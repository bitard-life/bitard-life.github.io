//-------------------------------------------------------------------------------------------------
var config = {
    //Ограничение максимального фпс
    fps_max: 30,
    
    //Настройки звука
    volume: 60,
    
    //Включает вывод в консоль отладотчной информации
    debug: true,
    
    //Включает отображение частоты кадров
    fps_show: true,
    
    //Полноэкранный режим
    fullscreen: false,
    
    //Включает постобработку
    post_proc: true
};

//-------------------------------------------------------------------------------------------------

var scenes = {
    //Сцена заглушка
    empty: {
        resources: {},
        layers: [],
        objects: {}
    },
    
    //Лол, сцена при загрузке уровня
    loading: {
        resources: {},
        layers: [ 'animation' ],
        objects: {
            animation: {
                draw: function() {
                    let context = game.canvas.context;
                    let iter = tmp.loading;
                    let over =  Math.ceil( ( game.canvas.height - ( window.innerHeight / game.canvas.scale ) ) / 2 );
                    let x = Math.ceil( game.canvas.width  / 2 ) - 40;
                    let y = Math.ceil( game.canvas.height / 2 ) - 10 + over;
                    
                    context.clearRect( 0, 0, game.canvas.width, game.canvas.height );
                    context.fillStyle = '#bcbcbc';
                    
                    for( let i = 0, w = 4; i < 4; i++ ) {
                        if( iter[ i * 2 + 1 ] == 4 ) {
                            iter[ i * 2 ] = 1;
                        } else if( iter[ i * 2 + 1 ] == 20 ) {
                            iter[ i * 2 ] = 0;
                        }
                        w = iter[ i * 2 + 1 ] += ( iter[ i * 2 ] == 0 ? -1 : 1 );
                        context.fillRect( x + 4 + i * 20, y + 4 - Math.ceil( w / 2 ), w, w );
                    }
                },
                update: function() {}
            }
        }

    }
};

var game = {
    //Игровое окно
    canvas: {
        id: null,
        context: null,
        width: 0,
        height: 0,
        scale: 1.0,
        rotate: false,
        resize: true
    },
    
    //Интервал обновления в миллисекундах
    delay: Math.ceil( 1000.0 / config.fps_max ),
    
    //Активная сцена (заменяется при актиавции сцены)
    scene: scenes.empty,
    
    //Функция постобработки кадра (заменяется при смене эффекта)
    postproc: function() { return; },
    
    //Текущий прогресс в прохождении
    checkpoint: 0,
    
    //Звук
    audio: {
        enabled: false,
        context: null,
        gain: null
    },
    
    //Флаг поддержки воспроизведения mp3 файлов
    mp3_sound: false,
    
    //Флаг мобильного устройства
    is_mobile: false,
    
    //Переменные для работы с курсором в игре
    cursor: {
        pos_x: 0,
        pos_y: 0,
        click_x: 0,
        click_y: 0,
        pressed: false
    },
    
    //Текущее значение fps
    fps: 0
};

var tmp = {
    loading: [ 1, 4,  1, 9,  1, 14,  0, 20 ],
    fps_max: config.fps_max
};
//-------------------------------------------------------------------------------------------------

//Загрузка ресурсов сцены в оперативную память
function LoadSceneMemory( resources, callback ) {
    //Перебираем ресурсы заявленные для сцены
    let res_names = Object.getOwnPropertyNames( resources );
    for( let i = 0, res_count = res_names.length; i < res_count; i++ ) {
        //Определяем тип ресурса
        switch( resources[ res_names[ i ] ].type ) {
            //Файл изображения --------------------------------------------------------------------
            case 'image':
                //Создаем Blob структуру из скачанных данных
                let image_blob = new Blob( [ resources[ res_names[ i ] ].file ] );
                
                //Создаем объект изображения
                let temp_img = new Image;
                temp_img.res_name = res_names[ i ];
                temp_img.onload = function() {
                    //Сохраняем ссылку на изображение
                    resources[ this.res_name ].data = this;
                    
                    //Освобождаем память занятую URL объектом
                    window.URL.revokeObjectURL( this.src );
                    
                    if( config.debug ) console.log( '[LoadSceneMemory] loaded: ' + this.res_name );
                }
                
                //Загружаем в объект изображения нашу Blob структуру с помощью URL метода
                temp_img.src = window.URL.createObjectURL( image_blob );
            break;
            
            //Файл изображения в формате base64 ---------------------------------------------------
            case 'image64':
                //Создаем объект изображения
                let temp_img64 = new Image;
                temp_img64.res_name = res_names[ i ];
                temp_img64.onload = function() {
                    //Сохраняем ссылку на изображение
                    resources[ this.res_name ].data = this;
                    
                    if( config.debug ) console.log( '[LoadSceneMemory] loaded: ' + this.res_name );
                }
                
                //Загружаем в объект изображения наши base64 данные
                temp_img64.src = resources[ temp_img64.res_name ].file;
            break;
            
            //Звуковой файл -----------------------------------------------------------------------
            case 'sound':
                //Асинхронное декодирование загруженного звукового файла
                game.audio.context.decodeAudioData(
                    //ArrayBuffer для декодирования
                    resources[ res_names[ i ] ].file,
                    
                    //Коллбек который вызовется при успешном декодировании
                    function( decodedAudio ) {
                        //Сохраняем ссылку на декодированное аудио
                        resources[ res_names[ i ] ].data = decodedAudio;
                        
                        //Создаем интерфейс управления
                        resources[ res_names[ i ] ].play = function( offset = 0, duration = 0 ) {
                            //Создаем аудиобуффер
                            resources[ res_names[ i ] ].source = game.audio.context.createBufferSource();
                            //Помещаем в него декодированные данные
                            resources[ res_names[ i ] ].source.buffer = resources[ res_names[ i ] ].data;
                            //Подключаем аудиобуфер к ноде громкости
                            resources[ res_names[ i ] ].source.connect( game.audio.gain );
                            //Зацикливаем аудио, если надо
                            if( duration == 0 ) resources[ res_names[ i ] ].source.loop = true;
                            //Запускаем проигрывание
                            resources[ res_names[ i ] ].source.start( 0, offset );
                        };
                        resources[ res_names[ i ] ].stop = function() {
                            //Останавливаем проигрывание
                            resources[ res_names[ i ] ].source.stop();  
                        };
                    }
                );
            break;
        }
    }
    
    //Ждем завершения загрузки ресурсов в память
    tmp.timerMemory = setInterval( function() {
        let res_names = Object.getOwnPropertyNames( resources );
        let res_count = res_names.length;
        let res_complete = 0;
            
        //Проверяем наличие ресурсов в памяти (поле data заполняется загрузившимся объектом в асинхронной функции)
        for( let i = 0; i < res_count; i++, res_complete++ ) {
            if( resources[ res_names[ i ] ].data === undefined ) break;
        }
            
        //Все ресурсы загружены в память
        if( res_count  === res_complete ) {
            if( config.debug ) console.log( '[LoadSceneMemory] all resource loaded' );
            
            //Удаляем таймер
            clearInterval( tmp.timerMemory );
            
            //Вызываем коллбэк
            callback();
        }
    }, 500 );
}

//Выгрузка ресурсов сцены из оперативной памяти
function FreeSceneMemory( resources ) {
    //Перебираем ресурсы заявленные для сцены
    let res_names = Object.getOwnPropertyNames( resources );
    for( let i = 0, res_count = res_names.length; i < res_count; i++ ) {
        //Определяем тип ресурса
        switch( resources[ res_names[ i ] ].type ) {
            //Выгружаем объект изображения из оперативки
            case 'image':
            case 'image64':
                resources[ res_names[ i ] ].data.src = '';
                resources[ res_names[ i ] ].data = null;
            break;
            
            //Выгружаем объект аудио из оперативки
            case 'sound':
                resources[ res_names[ i ] ].data.buffer = null;
            break;
        }
    }
    
    if( config.debug ) console.log( '[LoadSceneMemory] free' );
}

//Функция развертывания/свертывания на весь экран
function Fullscreen() {
    if ( !document.fullscreenElement ) {
        document.documentElement.requestFullscreen();
        config.fullscreen = true;
    } else {
        if ( document.exitFullscreen ) document.exitFullscreen();
        config.fullscreen = false;
    }
    
    if( config.debug ) console.log( '[Fullscreen] ' + config.fullscreen );
}

//-------------------------------------------------------------------------------------------------
//Main loops --------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

//Цикл обсчета сцены ------------------------------------------------------------------------------
function UpdateScene() {
    //Обновляем частоту кадров, если нужно
    if( config.fps_max !== tmp.fps_max ) {
        game.delay = Math.ceil( 1000.0 / config.fps_max );
        tmp.fps_max = config.fps_max;
    }
    
    //Изменяем уровень звука, если нужно
    if( config.volume !== tmp.volume ) {
        game.audio.gain.gain.value = parseFloat( ( config.volume / 100 ).toFixed( 1 ) );
        tmp.volume = config.volume;
    }
    
    //Обновляем объекты сцены
    for( let i = 0; i < game.scene.layers.length; i++ ) {
        game.scene.objects[ game.scene.layers[ i ] ].update();
    }
    
    //Запускаем очередную итерацию
    setTimeout( UpdateScene, game.delay );
};

//Цикл отрисовки сцены ----------------------------------------------------------------------------
function DrawScene() {
    //Получаем временную метку начала очередной отрисовки кадра
    let draw_ts = performance.now();
    
    //Ограничиваем частоту отрисовки
    if( draw_ts - tmp.draw_ts > game.delay ) {
        tmp.draw_ts = draw_ts;
        
        //Вычисление реальной частоты кадров
        if( draw_ts - tmp.fps.prev_ts < 1000.0 ) {
            tmp.fps.frames++;
        } else {
            //Обновляем на актуальное
            game.fps = tmp.fps.frames;
            
            //Сбрасываем временную метку и счетчик кадров
            tmp.fps.prev_ts = draw_ts;
            tmp.fps.frames = 0;
        }
        
        //Изменение размеров окна (не чаще 2-х раз в сек.)
        if( game.canvas.resize && ( draw_ts - tmp.resize_ts > 500.0 ) ) {
            game.canvas.resize = false;
            tmp.resize_ts = draw_ts;
            
            let dpr = window.devicePixelRatio || 1;
            let user_width = Math.max( window.innerWidth, window.innerHeight );
            let user_height = Math.min( window.innerWidth, window.innerHeight );
            
            //Рассчитываем масштабирование канваса по ширине
            game.canvas.scale = user_width / game.canvas.width;
            
            //Разрешение не более 1920х1980
            if( game.canvas.scale > 3.0 ) game.canvas.scale = 3.0;
            
            //Растягиваем канвас средствами css
            game.canvas.id.style.transform = 'scale( '+ game.canvas.scale +' )';
            
            //Проверяем корректность ориентации экрана
            game.canvas.rotate = ( window.innerHeight > window.innerWidth ? true : false );
            if( game.canvas.rotate ) {
                game.canvas.id.style.top = '0';
                game.canvas.id.style.left = '-50%';
                game.canvas.id.style.right = '-50%';
                game.canvas.id.style.transformOrigin = 'center';
            } else {
                game.canvas.id.style.left = '0';
                game.canvas.id.style.right = '0';
                if( window.innerHeight - ( game.canvas.scale * game.canvas.height ) > 10 ) {
                    //Места дофига сверху, центрируем канвас
                    game.canvas.id.style.top = '0';
                    game.canvas.id.style.transformOrigin = 'center';
                } else {
                    //Места мало, притягиваем канвас к нижней границе экрана
                    game.canvas.id.style.top = '';
                    game.canvas.id.style.transformOrigin = 'bottom';
                }
            }
        }
        
        //Очистка сцены
        let context = game.canvas.context;
        context.clearRect( 0, 0, game.canvas.width, game.canvas.height );
        
        //Проверяем правильность ориентации экрана
        if( game.canvas.rotate === false) {
            //Отрисовка рамки
            context.strokeStyle = '#2F2F2F';
            context.lineWidth = 1;
            context.lineCap = 'butt';
            context.strokeRect( 0, 0, game.canvas.width, game.canvas.height );
            
            //Отрисовка объектов сцены
            for( let i = 0; i < game.scene.layers.length; i++ ) {
                game.scene.objects[ game.scene.layers[ i ] ].draw();
            }
            
            //Постобработка кадра
            if( config.post_proc ) {
                game.postproc();
            }
        } else {
            //Рисуем значок поворота экрана мобилы в горизонталь
            let x_pos = Math.ceil( game.canvas.width / 2 );
            let y_pos = Math.ceil( game.canvas.height / 2 );
            context.strokeStyle = '#FFFFFF';
            context.lineWidth = 4;
            context.lineCap = 'round';
            context.beginPath();
            context.moveTo( x_pos - (50-3), y_pos + (66-50)  );
            context.lineTo( x_pos + (61-50), y_pos - (50-6) );
            context.lineTo( x_pos + (93-50), y_pos - (50-39) );
            context.lineTo( x_pos - (50-35), y_pos + (97-50) );
            context.lineTo( x_pos - (50-3), y_pos + (66-50) );
            context.stroke();
            context.moveTo( x_pos - (50-14), y_pos + (55-50)  );
            context.lineTo( x_pos - (50-46), y_pos + (86-50) );
            context.stroke();
            context.moveTo( x_pos - (50-23), y_pos + (74-50)  );
            context.lineTo( x_pos - (50-26), y_pos + (77-50) );
            context.stroke();
            context.moveTo( x_pos - (50-2), y_pos - (50-28)  );
            context.lineTo( x_pos - (50-16), y_pos - (50-14)  );
            context.lineTo( x_pos - (50-38), y_pos - (50-14)  );
            context.stroke();
            context.moveTo( x_pos - (50-38), y_pos - (50-14)  );
            context.lineTo( x_pos - (50-30), y_pos - (50-6)  );
            context.stroke();
            context.moveTo( x_pos - (50-38), y_pos - (50-14)  );
            context.lineTo( x_pos - (50-30), y_pos - (50-23)  );
            context.stroke();
        }
        
        //Отображение частоты кадров
        if( config.fps_show ) {
            context.fillStyle = '#ababab';
            context.font = 'normal 8pt Arial';
            context.fillText( 'FPS: ' + game.fps, 598, 356 );
        }
    }
    
    //Запускаем очередную отрисовку кадра, когда это будет удобно браузеру
    window.requestAnimationFrame( DrawScene );
};

//Инициализация игровго движка
function GameInit() {
    //Функция вывода ошибок инициализации пользователю
    function InitError( msg ) {
        document.getElementById( 'error_text' ).innerHTML = 'Ваш браузер не поддерживает ' + msg + '!';
        console.log( msg );
        return;
    }
    
    //---------------------------------------------------------------------------------------------
    //localStorage --------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    try {
        let test = 'test';
        localStorage.setItem( test, test );
        localStorage.removeItem( test );
    } catch(e) {
        return InitError( 'localStorage' );
    }
    
    //Получаем прогресс игрока
    let user_checkpoint = localStorage.getItem( 'checkpoint' );
    if( user_checkpoint !== null ) {
        game.checkpoint = user_checkpoint;
    }
    
    //---------------------------------------------------------------------------------------------
    //Canvas --------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    game.canvas.id = document.getElementById( 'canvas' );
    game.canvas.width = game.canvas.id.width;
    game.canvas.height = game.canvas.id.height;
    
    if( !( game.canvas.id.getContext  &&  game.canvas.id.getContext( '2d' ) ) ) return InitError( 'canvas' );
    game.canvas.context = game.canvas.id.getContext( '2d', { alpha: true } );
    
    //Проверяем доступность тача
    if( 'ontouchstart' in document.documentElement ) {
        //Мобильное управление
        game.is_mobile = true;
    }
    
    //Мышь
    game.canvas.id.addEventListener( 'mousedown', function( e ) {
        const rect = this.getBoundingClientRect();
        game.cursor.pos_x = game.cursor.click_x = e.clientX - rect.left;
        game.cursor.pos_y = game.cursor.click_y = e.clientY - rect.top;
        game.cursor.pressed = true;
        if( !game.audio.enabled ) {
            game.audio.enabled = true;
            game.audio.context.resume();
        }
    }, false );
    game.canvas.id.addEventListener( 'mousemove', function( e ) {
        const rect = this.getBoundingClientRect();
        game.cursor.pos_x = e.clientX - rect.left;
        game.cursor.pos_y = e.clientY - rect.top;
    }, false );
    document.addEventListener( 'mouseup', function( e ) {
        game.cursor.pressed = false;
    }, false );
    
    //Сообщаем игре, что изменились размеры окна
    window.addEventListener( 'resize', function() {
        game.canvas.resize = true;
    }, false );
    
    //Сообщаем игре, что  изменился полноэкранный режим
    document.addEventListener( 'fullscreenchange', function( e ) {
        if ( document.fullscreenElement ) {
            config.fullscreen = true;
        } else {
            config.fullscreen = false;
        }
    }, false );
    
    //---------------------------------------------------------------------------------------------
    //Blob & createObjectURL ----------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    if( ( function() {
            try {
                return !!new Blob();
            } catch (e) {
                return false;
            }
        }
        )() === false
    ) return InitError( 'Blob' );
    if ( !( window.URL && window.URL.createObjectURL ) ) return InitError( 'createObjectURL' );
    
    
    //---------------------------------------------------------------------------------------------
    //Sound ---------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    let mp3audio  = document.createElement( 'audio' );
    game.mp3_sound = !!( mp3audio.canPlayType  &&  mp3audio.canPlayType( 'audio/mpeg;' ).replace( /no/, '' ) );
    
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        game.audio.context = new AudioContext();
        game.audio.gain = game.audio.context.createGain();
        game.audio.gain.gain.value = parseFloat( ( config.volume / 100 ).toFixed( 1 ) );
        game.audio.gain.connect ( game.audio.context.destination );
    } catch(e) {
        return InitError( 'AudioContext' );
    }
    
    //Удаляем заглушку для вывода сообщений об ошибках инициализации
    document.body.removeChild( document.getElementById( 'error' ) );
    
    //Инициализируем временные переменные
    tmp.volume = config.volume;
    tmp.fps_max = config.fps_max;
    tmp.resize_ts = 0.0;
    tmp.draw_ts = 0.0;
    tmp.fps = {
        frames: 0,
        prev_ts: 0.0
    };
    
    //---------------------------------------------------------------------------------------------
    //Запускаем сцену загрузки ресурсов -----------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    scenes.preloader.enable();
    setTimeout( UpdateScene, game.delay );
    window.requestAnimationFrame( DrawScene );
};
//-------------------------------------------------------------------------------------------------


//Начинаем инициализировать игровой движок, как только страница загрузилась полностью
document.onreadystatechange = function() {
    if ( document.readyState == 'complete' ) GameInit();
};
