//-------------------------------------------------------------------------------------------------
var config = {
    //Ограничение максимального фпс
    fps_max: 30,
    
    //Включает отображение фпс
    fps_show: false,
    
    //Включает постобработку
    post_proc: true,
    
    //Полноэкранный режим
    fullscreen: false,
    
    //Разрешение
    resolution: 0,
    
    //Громкость
    volume: 60,
    
    //Текущий прогресс в прохождении
    checkpoint: 0,
    
    //Включает вывод в консоль отладотчной информации
    debug: true
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
                    let x = Math.ceil( game.canvas.width  / 2 ) - 40;
                    let y = Math.ceil( ( game.canvas.height + game.canvas.hidden_h ) / 2 ) - 10;
                    
                    context.clearRect( 0, 0, game.canvas.width, game.canvas.height );
                    context.fillStyle = 'rgb(188,188,188)';
                    
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
        hidden_h: 0,
        rotate: false,
        resize: true
    },
    
    //Доп. холст для пиксельных манипуляций
    temp_canvas: {
        id: null,
        context: null,
        width: 150,
        height: 150
    },
    
    //Текущее значение fps
    fps: 0,
    
    //Интервал обновления в миллисекундах
    delay: Math.ceil( 1000.0 / config.fps_max ),
    
    //Активная сцена (заменяется при актиавции сцены)
    scene: scenes.empty,
    
    //Функция постобработки кадра (заменяется при смене эффекта)
    postproc: function() { return; },
    
    //Флаг мобильного устройства
    is_mobile: false,
    
    //Звук
    audio: {
        mp3_support: false,
        enabled: false,
        context: null,
        gain: null
    },
    
    //Переменные для работы с курсором
    cursor: {
        pos_x: 0,
        pos_y: 0,
        click_x: 0,
        click_y: 0,
        wheel: 0,
        pressed: false
    },
    
    //Переменные для работы с клавиатурой
    keyboard: {
        tab: 0,
        plus: 0,
        minus: 0,
        up: 0,
        down: 0,
        left: 0,
        right: 0,
        page_up: 0,
        page_down: 0,
        del: 0,
        shift: false
    }
};

var tmp = {};

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

//Развертывание/свертывание на весь экран ---------------------------------------------------------
function Fullscreen() {
    if( !document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement ) {
        if( config.fullscreen ) {
            if( document.documentElement.requestFullscreen ) {
                document.documentElement.requestFullscreen();
            } else if( document.documentElement.mozRequestFullScreen ) {
                document.documentElement.mozRequestFullScreen();
            } else if( document.documentElement.webkitRequestFullscreen ) {
                document.documentElement.webkitRequestFullscreen( Element.ALLOW_KEYBOARD_INPUT );
            }
        }
    } else if( !config.fullscreen ) {
        if( document.exitFullscreen ) {
            document.exitFullscreen();
        } else if( document.cancelFullScreen ) {
            document.cancelFullScreen();
        } else if( document.mozCancelFullScreen ) {
            document.mozCancelFullScreen();
        } else if( document.webkitCancelFullScreen ) {
            document.webkitCancelFullScreen();
        }
    }
    
    if( config.debug ) console.log( 'Fullscreen(); -> ' + config.fullscreen );
}

//Загрузка ресурсов с сайта -----------------------------------------------------------------------
function LoadResources() {
    //Заполняем список ресурсов к скачиванию
    //tmp.download.resources = [ { src: '/../xxx.xxx', link: [ { scene: 'scene_name', object: 'object_name', name: 'res_name' }, ... ] }, ... ]
    
    //Перебираем сцены
    let scenes_names = Object.getOwnPropertyNames( scenes );
    for( let scn = 0; scn < scenes_names.length; scn++ ) {
        let scene_name = scenes_names[ scn ];
        let scene = scenes[ scene_name ];
        
        //Перебираем объекты сцены
        let scene_objects_names = Object.getOwnPropertyNames( scene.objects );
        for( let obj = 0; obj < scene_objects_names.length; obj++ ) {
            let object_name = scene_objects_names[ obj ];
            let object = scene.objects[ object_name ];
            
            //У объекта нашлись ресурсы на скачивание
            if( object.resources !== undefined ) {
                
                //Перебираем ресурсы и заносим их в список для скачивания
                let object_res_names = Object.getOwnPropertyNames( object.resources );
                for( let res = 0; res < object_res_names.length; res++ ) {
                    let resource_name = object_res_names[ res ];
                    let resource = object.resources[ resource_name ];
                        
                    //Поверяем, вдруг файл уже был загружен
                    if( resource.file !== undefined ) continue;
                    
                    //Для звука переключаем на поддерживаемый формат
                    if( resource.type == 'sound' ) resource.src = ( game.audio.mp3_support ? resource.mp3 : resource.ogg );
                    
                    //Поверяем, есть ли уже в списке на закачку такой ресурс
                    let res_found = false;
                    for( let i = 0; i < tmp.download.resources.length; i++ ) {
                        if( tmp.download.resources[ i ].src === resource.src ) {
                            //Сохраняем ссылку на ресурс для этой сцены (случай с одним ресурсом на несколько сцен)
                            tmp.download.resources[ i ].link.push( { scene: scene_name, object: object_name, name: resource_name } );
                            res_found = true;
                            break;
                        }
                    }
                    
                    if( res_found === false ) {
                        //Добавляем ресурс в список на закачку
                        tmp.download.resources.push( { src: resource.src, link:[ { scene: scene_name, object: object_name, name: resource_name } ] } );
                    }
                }
            }
        }
    }
    
    //Количество файлов к скачиванию
    tmp.download.files_count = tmp.download.resources.length;
    
    //Файлов чекнуто через HEAD
    tmp.download.files_checked = 0;
    
    //Файлов загружено
    tmp.download.files_load = 0;
    
    //Общее количество байт на скачивание
    tmp.download.bytes_all = 0;
    
    //Байт скачано
    tmp.download.bytes_load = 0;
    
    //Оцениваем размеры файлов, через http-заголовок HEAD
    for( let file = 0; file < tmp.download.files_count; file++ ) {
        let xhr = new XMLHttpRequest();
        xhr.open( 'HEAD', tmp.download.resources[ file ].src, true );
        xhr.onreadystatechange = function() {
            if( this.readyState == this.DONE ) {
                //Получаем и сохраняем размер файла
                let file_size = parseInt( xhr.getResponseHeader( 'Content-Length' ) );
                tmp.download.resources[ file ].size = file_size;
                
                //Увеличиваем счетчик общего количества байт для скачивания
                tmp.download.bytes_all += file_size;
                
                //Увеличиваем счетчик чекнутых файлов
                tmp.download.files_checked++;
                
                if( config.debug ) console.log( 'LoadResources(); -> HEAD [ ' + tmp.download.files_checked + '/' + tmp.download.files_count + ' ]: ' + tmp.download.resources[ file ].src );
            }
        };
        xhr.send();
    }
    
    //Ждем завершения оценки размеров файлов
    tmp.timerHEAD = setInterval( function() {
        if( tmp.download.files_count  === tmp.download.files_checked ) {
            clearInterval( tmp.timerHEAD );
            
            //Начинаем скачивать файлы ресурсов
            for( let file = 0; file < tmp.download.files_count; file++ ) {
                let xhr = new XMLHttpRequest();
                xhr.open( 'GET', tmp.download.resources[ file ].src, true );
                xhr.responseType = 'arraybuffer';
                
                //Сохраняем в объекте запроса количество скачанных байт
                xhr.loaded = 0;
                
                xhr.onprogress = function( e ) {
                    //Обновляем общее количество скачанных байт
                    tmp.download.bytes_load += e.loaded - this.loaded;
                    this.loaded = e.loaded;
                };
                
                xhr.onload = function( e ) {
                    //На случай кеширования файлов
                    tmp.download.bytes_load += tmp.download.resources[ file ].size - this.loaded;
                    
                    //Сохраняем массив байт в каждый слинкованый ресурс объекта
                    for( let link = 0; link < tmp.download.resources[ file ].link.length; link++ ) {
                        let scene_name = tmp.download.resources[ file ].link[ link ].scene;
                        let object_name = tmp.download.resources[ file ].link[ link ].object;
                        let resource_name = tmp.download.resources[ file ].link[ link ].name;
                        
                        scenes[ scene_name ].objects[ object_name ].resources[ resource_name ].file = this.response;
                    }
                    
                    //Увеличиваем счетчик загруженных файлов
                    tmp.download.files_load++;
                    
                    if( config.debug ) console.log( 'LoadResources(); -> GET [ ' + tmp.download.files_load + '/' + tmp.download.files_count + ' ]: ' + tmp.download.resources[ file ].src );
                };
                
                xhr.send();
            }
        }
    }, 500 );
};

//Запуск сцены ------------------------------------------------------------------------------------
function StartScene( scene_name, func_scene_start ) {
    let scene = scenes[ scene_name ];
    if( scene === undefined ) return;
    
    
    let scene_resource_all = 0;
    let scene_resource_loaded = 0;
    
    if( game.scene !== scenes.empty ) {
        if( config.debug ) console.log( 'StopScene( "' + game.scene.name + '" );' );
        
        //Удаляем всё из слоёв отрисовки
        game.scene.layers.clear();
        
        //Отключаем постобработку
        game.postproc = function() { return; };
        
        //Выгрузка ресурсов объектов сцены из оперативной памяти
        let scene_objects = Object.getOwnPropertyNames( game.scene.objects );
        for( let obj = 0; obj < scene_objects.length; obj++ ) {
            let object_name = scene_objects[ obj ];
            let object = game.scene.objects[ object_name ];
            
            //Перебираем ресурсы объекта
            if( object.resources === undefined ) continue;
            let object_res = Object.getOwnPropertyNames( object.resources );
            for( let res = 0; res < object_res.length; res++ ) {
                let resource_name = object_res[ res ];
                let resource = object.resources[ resource_name ];
            
                //Определяем тип ресурса
                switch( resource.type ) {
                    //Выгружаем объект изображения из оперативки
                    case 'image':
                    case 'image64':
                        resource.data.src = '';
                        resource.data = null;
                    break;
                    
                    //Выгружаем объект аудио из оперативки
                    case 'sound':
                        if( resource.source !== undefined ) {
                            resource.source.stop();
                            resource.source.buffer = null;
                            resource.source = null;
                        }
                        resource.data = null;
                        resource.play = null;
                        resource.stop = null;
                    break;
                }
                if( config.debug ) console.log( 'StopScene( "' + game.scene.name + '" ); -> Ресурс "' + resource_name + '" выгружен из памяти.' );
            }
        }
    
        if( config.debug ) console.log( 'StopScene( "' + game.scene.name + '" ); -> Все ресурсы выгружены из памяти.' );
        
        //Включаем сцену "загрузки сцены"
        game.scene = scenes.loading;
    }
    
    if( config.debug ) console.log( 'StartScene( "' + scene_name + '" );' );
    
    
    
    //Перебираем объекты сцены
    let scene_objects = Object.getOwnPropertyNames( scene.objects );
    for( let obj = 0; obj < scene_objects.length; obj++ ) {
        let object_name = scene_objects[ obj ];
        let object = scene.objects[ object_name ];
        
        //Перебираем ресурсы объекта
        if( object.resources === undefined ) continue;
        let object_res = Object.getOwnPropertyNames( object.resources );
        for( let res = 0; res < object_res.length; res++ ) {
            let resource_name = object_res[ res ];
            let resource = object.resources[ resource_name ];
            
            //Загрузка ресурсов сцены в оперативную память ----------------------------------------
            switch( resource.type ) {
                //Файл изображения
                case 'image':
                    //Увеличиваем общий счетчик ресурсов
                    scene_resource_all++;
                    
                    //Создаем Blob структуру из скачанных данных
                    let image_blob = new Blob( [ resource.file ] );
                    
                    //Создаем объект изображения
                    let temp_img = new Image;
                    temp_img.onload = function() {
                        if( config.debug ) console.log( 'StartScene( "' + scene_name + '" ); -> Ресурс "' + resource_name + '" загружен в память.' );
                        
                        //Сохраняем ссылку на изображение
                        resource.data = this;
                        
                        //Освобождаем память занятую URL объектом
                        window.URL.revokeObjectURL( this.src );
                        
                        //Увеличиваем счетчик загруженных ресурсов
                        scene_resource_loaded++;
                    }
                    
                    //Загружаем в объект изображения нашу Blob структуру с помощью URL метода
                    temp_img.src = window.URL.createObjectURL( image_blob );
                break;
                
                //Файл изображения в формате base64
                case 'image64':
                    //Увеличиваем общий счетчик ресурсов
                    scene_resource_all++;
                    
                    //Создаем объект изображения
                    let temp_img64 = new Image;
                    temp_img64.onload = function() {
                        if( config.debug ) console.log( 'StartScene( "' + scene_name + '" ); -> Ресурс "' + resource_name + '" загружен в память.' );
                        
                        //Сохраняем ссылку на изображение
                        resource.data = this;
                        
                        //Увеличиваем счетчик загруженных ресурсов
                        scene_resource_loaded++;
                    }
                    
                    //Загружаем в объект изображения наши base64 данные
                    temp_img64.src = resource.file;
                break;
                
                //Звуковой файл
                case 'sound':
                    //Увеличиваем общий счетчик ресурсов
                    scene_resource_all++;
                    
                    //Асинхронное декодирование загруженного звукового файла
                    game.audio.context.decodeAudioData(
                        //ArrayBuffer для декодирования
                        resource.file,
                        
                        //Коллбек который вызовется при успешном декодировании
                        function( decodedAudio ) {
                            if( config.debug ) console.log( 'StartScene( "' + scene_name + '" ); -> Ресурс "' + resource_name + '" загружен в память.' );
                            
                            //Сохраняем ссылку на декодированное аудио
                            resource.data = decodedAudio;
                            
                            //Создаем интерфейс управления
                            resource.play = function( offset = 0, duration = 0 ) {
                                //Создаем аудиобуффер
                                resource.source = game.audio.context.createBufferSource();
                                //Помещаем в него декодированные данные
                                resource.source.buffer = resource.data;
                                //Подключаем аудиобуфер к ноде громкости
                                resource.source.connect( game.audio.gain );
                                //Зацикливаем аудио, если надо
                                if( duration == 0 ) resource.source.loop = true;
                                //Запускаем проигрывание
                                resource.source.start( 0, offset );
                            };
                            resource.stop = function() {
                                //Останавливаем проигрывание
                                resource.source.stop();  
                            };
                            
                            //Увеличиваем счетчик загруженных ресурсов
                            scene_resource_loaded++;
                        }
                    );
                break;
            }
        }
    }
    
    //Ждем завершения загрузки ресурсов в оперативную память
    tmp.timerLoadScene = setInterval( function() {
        //Все ресурсы загружены в память
        if( scene_resource_all === scene_resource_loaded ) {
            if( config.debug ) console.log( 'StartScene( "' + scene_name + '" ); -> Все ресурсы загружены в память.' );
            
            //Удаляем таймер
            clearInterval( tmp.timerLoadScene );
            
            //Запускаем сцену
            game.scene = scene;
            
            //Вызываем коллбэк
            func_scene_start();
        }
    }, 500 );
};

//Цикл обсчета сцены ------------------------------------------------------------------------------
function UpdateScene() {
    //Получаем временную метку начала обсчета сцены
    tmp.update_ts = performance.now();
    
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
    
    //Обновляем объекты сцены( с конца )
    for( let layer_ind = temp_ind = game.scene.layers.length; layer_ind > 0; layer_ind-- ) {
        game.scene.objects[ game.scene.layers[ layer_ind - 1 ] ].update();
        
        //Изменился список отрисовки
        if( game.scene.layers.length !== temp_ind  ) break;
    }
    
    //Запускаем очередную итерацию обновления сцены
    setTimeout( UpdateScene, game.delay );
};

//Цикл отрисовки сцены ----------------------------------------------------------------------------
function DrawScene() {
    //Получаем временную метку начала отрисовки сцены
    let draw_ts = tmp.draw_ts = performance.now();
    
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
    if( game.canvas.resize && ( draw_ts - tmp.resize_start_ts > 250.0 ) && ( draw_ts - tmp.resize_ts > 500.0 ) ) {
        game.canvas.resize = false;
        tmp.resize_ts = draw_ts;
        
        let dpr = window.devicePixelRatio || 1;
        let user_width = Math.max( window.innerWidth, window.innerHeight );
        let user_height = Math.min( window.innerWidth, window.innerHeight );
        
        //Проверяем корректность ориентации экрана
        game.canvas.rotate = ( window.innerHeight > window.innerWidth ? true : false );
        if( game.canvas.rotate ) {
            game.canvas.id.width = window.innerWidth - 20;
            game.canvas.id.height = window.innerHeight - 20;
            game.canvas.id.style.top = '0';
            game.canvas.id.style.transformOrigin = 'center';
            game.canvas.id.style.transform = 'scale( 1 )';
            
            //Фикс для мобил, задержка изменения фактических размеров экрана 3 сек.
            if( draw_ts - tmp.resize_start_ts < 3000.0 ) game.canvas.resize = true;
        } else {
            //Сбрасываем размеры холста
            game.canvas.id.width = game.canvas.width;
            game.canvas.id.height = game.canvas.height;
            
            //Определяем, не нужно ли вернуть масштаб назад
            if( parseInt( localStorage.getItem( 'resolution' ) )  >  config.resolution ) {
                if( 
                    ( config.resolution + 1 ) * ( game.canvas.height - ( game.canvas.height / 100) * 29 )  <= user_height &&
                    ( config.resolution + 1 ) * ( game.canvas.width -  ( game.canvas.width  / 100) * 9  )  <= user_width 
                ) {
                    //Увеличиваем разрешение на один пункт
                    config.resolution++;
                    game.canvas.resize = true;
                }
            }
            
            if( config.resolution === 0 ) {
                //Автоматическое масштабирование по ширине
                game.canvas.scale = user_width / game.canvas.width;
                if( game.canvas.scale > 3.0 ) game.canvas.scale = 3.0;
                
                //Определяем, не скрылось ли много по высоте ( 30% )
                if ( game.canvas.height - user_height / game.canvas.scale > ( game.canvas.height / 100) * 30 ) {
                    //Автоматическое масштабирование по высоте
                    game.canvas.scale = user_height / game.canvas.height;
                }
            } else {
                //Пользовательское разрешение
                game.canvas.scale = config.resolution;
                
                //Определяем, не скрылось ли много по ширине ( 10% )
                if ( game.canvas.width - user_width / game.canvas.scale > ( game.canvas.width / 100) * 10 ) {
                    //Приводим к ширине масштаб
                    game.canvas.scale = user_width / game.canvas.width;
                    if( game.canvas.scale > 3.0 ) game.canvas.scale = 3.0;
                    
                    //Определяем, не скрылось ли много по высоте ( 30% )
                    if ( game.canvas.height - user_height / game.canvas.scale > ( game.canvas.height / 100) * 30 ) {
                        //Уменьшаем разрешение на один пункт
                        config.resolution--;
                        game.canvas.resize = true;
                    }
                //Определяем, не скрылось ли много по высоте ( 30% )
                } else if ( game.canvas.height - user_height / game.canvas.scale > ( game.canvas.height / 100) * 30 ) {
                    //Приводим к высоте масштаб
                    game.canvas.scale = user_height / game.canvas.height;
                    if( game.canvas.scale < 1.0 ) {
                        //Уменьшаем разрешение на один пункт
                        config.resolution--;
                        game.canvas.resize = true;
                    }
                }
            }
            
            //Масштабируем канвас средствами css
            game.canvas.id.style.transform = 'scale( '+ game.canvas.scale +' )';
            
            //Проверяем сколько скрыто по высоте
            game.canvas.hidden_h = Math.floor( game.canvas.height - user_height / game.canvas.scale );
            game.canvas.hidden_h = ( game.canvas.hidden_h < 0 ? 0 : game.canvas.hidden_h );
            
            //Провеяем центровку
            if( user_height - ( game.canvas.scale * game.canvas.height ) > 1 ) {
                //Сверху есть место, центрируем канвас по вертикали
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
        context.strokeStyle = 'rgb(47,47,47)';
        context.lineWidth = 1;
        context.lineCap = 'butt';
        context.strokeRect( 0, 0, game.canvas.width, game.canvas.height );
        
        //Отрисовка объектов сцены
        for( let i = 0, layers_len = game.scene.layers.length; i < layers_len; i++ ) {
            game.scene.objects[ game.scene.layers[ i ] ].draw();
            
            //Изменился список отрисовки
            if( layers_len !== game.scene.layers.length ) break;
        }
        
        //Постобработка кадра
        if( config.post_proc ) game.postproc();
        
        //Отображение частоты кадров
        if( config.fps_show ) {
            context.fillStyle = 'rgb(171,171,171)';
            context.font = 'normal 8pt Arial';
            context.fillText( 'FPS: ' + game.fps, 598, 356 );
        }
    } else {
        //Рисуем значок поворота экрана мобилы в горизонталь
        let x_pos = Math.ceil( game.canvas.id.width / 2 );
        let y_pos = Math.ceil( game.canvas.id.height / 2 );
        let scale = Math.ceil( x_pos / 100 );
        let icon = tmp.rotate_icon;
        
        context.strokeStyle = 'rgb(255,255,255)';
        context.lineWidth = 4;
        context.lineCap = 'round';
        
        context.beginPath();
            context.moveTo( x_pos - scale * 47, y_pos + scale * 16 );
            context.lineTo( x_pos + scale * 11, y_pos - scale * 44 );
            context.lineTo( x_pos + scale * 43, y_pos - scale * 11 );
            context.lineTo( x_pos - scale * 15, y_pos + scale * 47 );
        context.closePath();
        context.stroke();
        
        context.beginPath();
            context.moveTo( x_pos - scale * 36, y_pos + scale * 5 );
            context.lineTo( x_pos - scale * 4,  y_pos + scale * 36 );
        context.stroke();
            context.moveTo( x_pos - scale * 27, y_pos + scale * 24 );
            context.lineTo( x_pos - scale * 24, y_pos + scale * 27 );
        context.stroke();
            context.moveTo( x_pos - scale * 48, y_pos - scale * 22 );
            context.lineTo( x_pos - scale * 34, y_pos - scale * 36 );
            context.lineTo( x_pos - scale * 12, y_pos - scale * 36 );
        context.stroke();
            context.moveTo( x_pos - scale * 12, y_pos - scale * 36 );
            context.lineTo( x_pos - scale * 20, y_pos - scale * 44 );
        context.stroke();
            context.moveTo( x_pos - scale * 12, y_pos - scale * 36 );
            context.lineTo( x_pos - scale * 20, y_pos - scale * 27 );
        context.stroke();
    }
    
    //Запускаем очередную отрисовку кадра, когда это будет удобно браузеру
    setTimeout( function() {
        window.requestAnimationFrame( DrawScene, game.canvas.id );
    }, game.delay );
};


//Функция рисования линии попиксельно
function PixelLine( bytes, canvas_w, Rc, Gc, Bc, Ac, x0, y0, x1, y1 ) {
    //http://rosettacode.org/wiki/Bitmap/Bresenham's_line_algorithm#JavaScript
    let dx = Math.abs( x1 - x0 );
    let sx = ( x0 < x1 ? 1 : -1 );
    let dy = Math.abs( y1 - y0 );
    let sy = ( y0 < y1 ? 1 : -1 );
    let err = ( dx > dy ? dx : -dy ) / 2;
    let e, n;
    
    while( true ) {
        n =  ( x0 + y0 * canvas_w ) * 4;
        bytes[ n ] = Rc;
        bytes[ n + 1 ] = Gc;
        bytes[ n + 2 ] = Bc;
        bytes[ n + 3 ] = Ac;
        
        if( x0 === x1 && y0 === y1 ) break;
        
        e = err;
        if( e > -dx ) {
            err -= dy;
            x0 += sx;
        }
        if( e < dy ) {
            err += dx;
            y0 += sy;
        }
    }
};

//Функция заливки замкнутого контура попиксельно (глючно, но быстро)
function PixelFull( bytes, canvas_w, Rc, Gc, Bc, Ac, x, y, Rf, Gf, Bf, Af ) {
    let curr_pos, check_pos;
    let curr_x = x, curr_y = y;
    let tmp_x = x, tmp_y = y;
    let find_x = x, find_y = y;
    let op = 0;
    let dir_left = true, dir_top = true;
    
    do {
        curr_pos = ( curr_x + curr_y * canvas_w ) * 4;
        
        //Наткнулись на контур
        if( bytes[ curr_pos ] === Rc && bytes[ curr_pos + 1 ] === Gc && bytes[ curr_pos + 2 ] === Bc && bytes[ curr_pos + 3 ] === Ac ) {
            //Меняем направлениe направо, если двигались влево
            if( dir_left ) {
                dir_left = false;
                curr_x = tmp_x, curr_y = tmp_y;
            } else {
                //Завершили движение направо, проверяем дошли ли до верха/низа контура
                if( find_x === tmp_x  &&  find_y === tmp_y ) {
                    if( dir_top ) {
                        //Начинаем движение вниз от начальной точки
                        dir_top = false;
                        curr_x = find_x = x;
                        curr_y = find_y = y;
                        op++;
                        continue;
                    } else {
                        //Дошли до низа контура, завершаем перекрас
                        break;
                    }
                } else {
                    //Сдвигаемся наверх/вниз
                    dir_left = true;
                    tmp_x = curr_x = find_x;
                    tmp_y = curr_y = find_y;
                }
            }
        } else {
            //Перекрашиваем текущий пиксель
            bytes[ curr_pos ] = Rf;
            bytes[ curr_pos + 1 ] = Gf;
            bytes[ curr_pos + 2 ] = Bf;
            bytes[ curr_pos + 3 ] = Af;
            
            //Проверяем верхний/нижний пиксель
            check_pos = ( curr_x + ( curr_y + ( dir_top ? -1 : 1 ) ) * canvas_w ) * 4;
            if( bytes[ check_pos ] !== Rc  ||  bytes[ check_pos + 1 ] !== Gc  ||  bytes[ check_pos + 2 ] !== Bc  ||  bytes[ check_pos + 3 ] !== Ac ) {
                //Сохраняем позицию найденного пикселя
                find_x = curr_x;
                find_y = curr_y + ( dir_top ? -1 : 1 );
            }
            
            //Сдвигаемся на соседний пиксель
            curr_x += ( dir_left ? -1 : 1 ); 
        }
        
        //Ограничитель операций (подстраховка)
        op++;
    } while( op < 10000 );
};

//Функция отрисовки по опорным точкам на временном холсте
function DrawRefPoints( ref_points ) {
    //Получаем короткие ссылки
    let temp_context = game.temp_canvas.context;
    let temp_canvas_w = game.temp_canvas.width;
    let temp_canvas_h = game.temp_canvas.height;
    
    //Очищаем временный холст
    temp_context.clearRect( 0, 0, temp_canvas_w, temp_canvas_h );
    
    //Копируем пиксельные данные с временного холста
    let imageData = temp_context.getImageData( 0, 0, temp_canvas_w, temp_canvas_h );
    let imageBytes = imageData.data;
    
    //Получаем цвет контура
    let Rc = Math.floor( ref_points[ 0 ][ 0 ] );
    let Gc = Math.floor( ref_points[ 0 ][ 1 ] );
    let Bc = Math.floor( ref_points[ 0 ][ 2 ] );
    let Ac = Math.floor( ref_points[ 0 ][ 3 ] );
    
    //Меняем цвет контура, для заливки поверх имеющихся конутров
    let ref_len = ref_points.length;
    let redshift = ( Rc + ref_len > 255 ? -1 : 1 );
    
    //Отрисовка по опорным точкам
    for( let i = 1, j, x0, y0, x1, y1, Rf, Gf, Bf, Af, Rc_uniq, points_len; i < ref_len; i++ ) {
        Rc_uniq = Rc + i * redshift;
        
        //Рисуем замкнутый контур
        for( j = 7, points_len = ref_points[ i ].length; j < points_len; j +=2 ) {
            //Получаем координаты линии
            x0 = Math.floor( ref_points[ i ][ j ] );
            y0 = Math.floor( ref_points[ i ][ j + 1 ] );
            if( j !== points_len - 2 ) {
                x1 = Math.floor( ref_points[ i ][ j + 2 ] );
                y1 = Math.floor( ref_points[ i ][ j + 3 ] );  
            } else {
                //Предпоследнюю точку замыкаем с первой
                x1 = Math.floor( ref_points[ i ][ 7 ] );
                y1 = Math.floor( ref_points[ i ][ 8 ] );  
            }
            
            //Рисуем линию попиксельно
            PixelLine( imageBytes, temp_canvas_w, Rc_uniq, Gc, Bc, Ac, x0, y0, x1, y1 );
        }
        
        //Получаем цвет заливки
        Rf = Math.floor( ref_points[ i ][ 1 ] );
        Gf = Math.floor( ref_points[ i ][ 2 ] );
        Bf = Math.floor( ref_points[ i ][ 3 ] );
        Af = Math.floor( ref_points[ i ][ 4 ] );
        
        //Получаем коорданаты точки заливки
        x0 = Math.floor( ref_points[ i ][ 5 ] );
        y0 = Math.floor( ref_points[ i ][ 6 ] );
        
        //Заливаем замкнутый контур
        PixelFull( imageBytes, temp_canvas_w, Rc_uniq, Gc, Bc, Ac, x0, y0, Rf, Gf, Bf, Af );
        
        //Очистка от окантовки между первой и второй точкой
        if( ref_points[ i ][ 0 ] === 1 ) {
            x0 = Math.floor( ref_points[ i ][ 7 ] );
            y0 = Math.floor( ref_points[ i ][ 8 ] );
            x1 = Math.floor( ref_points[ i ][ 9 ] );
            y1 = Math.floor( ref_points[ i ][ 10 ] );
            
            //Чертим линию цвета заливки
            PixelLine( imageBytes, temp_canvas_w, Rf, Gf, Bf, Af, x0, y0, x1, y1 );
            
            //Восстанавливаем контур крайних точек от заливки
            j =  ( x0 + y0 * temp_canvas_w ) * 4;
            imageBytes[ j ] = Rc_uniq;
            imageBytes[ j + 1 ] = Gc;
            imageBytes[ j + 2 ] = Bc;
            imageBytes[ j + 3 ] = Ac;
            j =  ( x1 + y1 * temp_canvas_w ) * 4;
            imageBytes[ j ] = Rc_uniq;
            imageBytes[ j + 1 ] = Gc;
            imageBytes[ j + 2 ] = Bc;
            imageBytes[ j + 3 ] = Ac;
        }
    }
    
    //Вставляем на временный холст отредактированные пиксельные данные
    temp_context.putImageData( imageData, 0, 0 );
};

//Создание матрицы преобразований координат опорных точек между двумя состояниями, за нужное количество шагов
function AnimateMatrix( ref_start, ref_end, frames_count ) {
    let output = [];
    
    for( let i = 1, j, ref_len = ref_start.length; i < ref_len; i++ ) {
        output[ i ] = [];
        for( j = 1, points_len = ref_start[ i ].length; j < points_len; j++ ) {
            output[ i ].push( ( ref_end[ i ][ j ] - ref_start[ i ][ j ]  ) / frames_count );
        }
    }
    
    return output;
};

//Преобразование координат опорных точек согласно шагу
function UpdateAnimation( _this ) {
    let ref_points = _this.tmp.ref_points;
    let play_manager = _this.play_manager;
    
    //Проверяем, требуется ли преобразование координат
    if( play_manager.is_played === false ) return;
    
    //Проверяем, требуется ли пересчет матрицы преобразований
    let update = false;
    
    //Изменился фреймрейт
    if( play_manager.delay !== game.delay ) {
        play_manager.delay = game.delay;
        update = true;
    }
    
    //Фаза анимации закончилась
    if( play_manager.frame === play_manager.frames_count ) {
        //Переключаем на следующую фазу анимации
        play_manager.phase++;
        play_manager.phase_count--;
        update = true;
        
        //Больше фаз нет
        if( play_manager.phase === play_manager.animation.length  ||  play_manager.phase_count === 0 ) {
            //Перезапускаем анимацию сначала
            if( play_manager.loop === true  ||  play_manager.phase_count > 0 ) {
                play_manager.phase = 0;
            } else if ( play_manager.phase_ending !== null ) {
                //Проигрываем последнюю фазу
                play_manager.phase = play_manager.phase_ending;
                play_manager.phase_ending = null;
                play_manager.phase_count = 1;
            } else {
                //Останавливаем анимацию
                play_manager.is_played = false;
                update = false;
            }
        }
    }
    
    //Пересчет матрицы преобразований
    if( update ) {
        play_manager.frame = 0;
        play_manager.frames_count = Math.floor( play_manager.animation[ play_manager.phase ][ 0 ][ 4 ] / play_manager.delay );
        play_manager.matrix = AnimateMatrix( ref_points, play_manager.animation[ play_manager.phase ], play_manager.frames_count );
    }
    
    //Преобразование координат
    if( play_manager.is_played ) {
        play_manager.frame++;
        for( let i = 1; i < ref_points.length; i++ ) {
            for( let j = 1, points_len = ref_points[ i ].length; j < points_len; j +=2 ) {
                ref_points[ i ][ j ] += play_manager.matrix[ i ][ j - 1 ];
                ref_points[ i ][ j + 1 ] += play_manager.matrix[ i ][ j ];
            }
        }
    }
};

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

//Инициализация игровго движка
function GameInit() {
    //Функция вывода ошибок инициализации пользователю
    function InitError( msg ) {
        document.getElementById( 'error_text' ).innerHTML = 'Ваш браузер не поддерживает ' + msg + '!';
        console.log( msg );
        return;
    }
    
    //---------------------------------------------------------------------------------------------
    //Автоматическое добавление методов и параметров ----------------------------------------------
    //---------------------------------------------------------------------------------------------
    
    //Перебираем сцены
    let scenes_names = Object.getOwnPropertyNames( scenes );
    for( let scn = 0; scn < scenes_names.length; scn++ ) {
        let scene_name = scenes_names[ scn ];
        let scene = scenes[ scene_name ];
        
        //Добавляем на сцену её название
        scene.name = scene_name;
        
        //Добавляем на сцену массив отрисовки
        scene.layers = [];
        
        //Добавляем функцию корректной очистки массива отрисовки
        scene.layers.clear = function() {
            for( let i = 0, layers = game.scene.layers.length; i < layers; i++ ) {
                //Удаляем объекты в обратном порядке
                if( game.scene.layers.length > 0 ) game.scene.objects[ game.scene.layers[ game.scene.layers.length - 1 ] ].del();
            }
        };
        
        //Перебираем объекты сцены
        let scene_objects_names = Object.getOwnPropertyNames( scene.objects );
        for( let obj = 0; obj < scene_objects_names.length; obj++ ) {
            let object_name = scene_objects_names[ obj ];
            let object = scene.objects[ object_name ];
            
            //Добавление объекта на сцену
            object.add = function() {
                if( config.debug ) console.log( 'game.scene.add( "' + object_name + '" );' );
                
                //На случай импорта из другой сцены
                if( game.scene.objects[ object_name ] === undefined ) {
                    game.scene.objects[ object_name ] = this;
                }
                
                //Инициализируем объект
                if( this.init !== undefined ) this.init();
                
                //Включаем отрисовку объекта
                game.scene.layers.push( object_name );
            };
            
            //Удаление объекта со сцены
            object.del = function() {
                let obj_pos = game.scene.layers.indexOf( object_name );
                if( obj_pos > -1 ) {
                    if( config.debug ) console.log( 'game.scene.del( "' + object_name + '" );' );
                    
                    //Удаляем из списка на отрисовку
                    game.scene.layers.splice( obj_pos, 1 );
                    
                    //Удаляем временные переменные
                    delete this.tmp;
                }
            };
            
            //Управление анимацией
            if( object.animations !== undefined ) {
                object.play_manager = {
                    animation: null,
                    delay: game.delay,
                    phase: 0,
                    phase_count: 0,
                    phase_ending: null,
                    frame: 0,
                    frames_count: 0,
                    loop: false,
                    delay: game.delay,
                    matrix: [],
                    is_played: false
                };
                
                //Создаем методы для управления анимацией
                object.play = function( animation, phase_ms = 0, loop = false, phase = 0, phase_count = 0, phase_ending = null ) {
                    let manager = this.play_manager;
                    manager.animation = animation;
                    manager.delay = game.delay;
                    manager.phase = phase;
                    manager.phase_count = ( phase_count === 0 ? animation.length : phase_count );
                    manager.phase_ending = phase_ending;
                    manager.frame = 0;
                    manager.frames_count = Math.floor( ( phase_ms === 0 ? 500 : animation[ phase ][ 0 ][ 4 ] ) / manager.delay );
                    manager.loop = loop;
                    manager.matrix = AnimateMatrix( this.tmp.ref_points, animation[ phase ], manager.frames_count );
                    manager.is_played = true;
                };
            }
        }
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
    
    //Загружаем конфиг
    Object.getOwnPropertyNames( config ).forEach( function( name ) {
        if( name == 'debug' ) return;
                                                 
        if( localStorage.getItem( name ) !== null ) {
            config[ name ] = localStorage.getItem( name );
            if( config[ name ] === 'true'  || config[ name ] === 'false' ) {
                config[ name ] = ( config[ name ] === 'true' ? true : false );
            } else {
                config[ name ] = parseInt( config[ name ] );
            }
        } else {
            localStorage.setItem( name, config[ name ]  );
        }
    } );
    
    
    
    //---------------------------------------------------------------------------------------------
    //Canvas --------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    
    //Основной холст
    game.canvas.id = document.getElementById( 'canvas' );
    game.canvas.width = game.canvas.id.width;
    game.canvas.height = game.canvas.id.height;
    if( !( game.canvas.id.getContext  &&  game.canvas.id.getContext( '2d' ) ) ) return InitError( 'canvas' );
    game.canvas.context = game.canvas.id.getContext( '2d', { antialias: false, alpha: true } );
    
    //Вспомогательный холст
    game.temp_canvas.id = document.createElement( 'canvas' );
    game.temp_canvas.width = game.temp_canvas.width;
    game.temp_canvas.height = game.temp_canvas.height;
    if( !( game.temp_canvas.id.getContext  &&  game.temp_canvas.id.getContext( '2d' ) ) ) return InitError( 'canvas' );
    game.temp_canvas.context = game.temp_canvas.id.getContext( '2d', { antialias: false, alpha: true } );
    game.temp_canvas.drawRefPoints = DrawRefPoints;
    
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
        
        //Разрешаем аудио на странице
        if( !game.audio.enabled ) {
            game.audio.enabled = true;
            game.audio.context.resume();
        }
        
        //Мегакостыли для полного экрана (ничего не придумал лучше)
        if( tmp.menu !== undefined  &&  game.scene === scenes.menu ) {
            if( tmp.menu.settings !== undefined ) {
                //Включение/выключение полного экрана в настройках
                game.scene.objects.settings.update();
            } else if( tmp.menu.disclaimer !== undefined ) {
                //Включаем полный экран через нажатие на дисклеймер (если так было сохранено в конфиге)
                game.scene.objects.disclaimer.update();
            }
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
        tmp.resize_start_ts = performance.now();
        game.canvas.resize = true;
    }, false );
    
    //Обрабатываем колесико мыши
    game.canvas.id.addEventListener( 'wheel', function( e ) {
        e = e || window.event;
        let delta = e.deltaY || e.detail || e.wheelDelta;
        game.cursor.wheel += ( delta > 0 ? 1 : -1 );
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }, false );
    
    
    
    //---------------------------------------------------------------------------------------------
    //Keyboard ------------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    
    document.body.addEventListener ( 'keydown', function( e ) {
        switch( e.keyCode ) {
            case 9: //Tab
                document.body.focus();
                game.keyboard.tab++;
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            break;
            
            case 16: //Shift
                game.keyboard.shift = true;
            break;
            
            case 33: //Page Up
                game.keyboard.page_up++;
            break;
            
            case 34: //Page Down
                game.keyboard.page_down++;
            break;
            
            case 37: //Влево
                game.keyboard.left++;
            break;
            
            case 38: //Вверх
                game.keyboard.up++;
            break;
            
             case 39: //Вправо
                game.keyboard.right++;
            break;
            
            case 40: //Вниз
                game.keyboard.down++;
            break;
            
            case 46: //Delete
                game.keyboard.del++;
            break;
            
            case 107: //Плюс
                game.keyboard.plus++;
            break;
            
            case 109: //Минус
                game.keyboard.minus++;
            break;
        }
    }, false );
    
    document.body.addEventListener ( 'keyup', function( e ) {
        switch( e.keyCode ) {
            case 16: //Shift
                game.keyboard.shift = false;
            break;
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
    game.audio.mp3_support = !!( mp3audio.canPlayType  &&  mp3audio.canPlayType( 'audio/mpeg;' ).replace( /no/, '' ) );
    
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
    tmp.resize_start_ts = 0.0;
    tmp.resize_ts = 0.0;
    tmp.update_ts = 0.0;
    tmp.draw_ts = 0.0;
    tmp.fps = {
        frames: 0,
        prev_ts: 0.0
    };
    tmp.download = {
        resources: [],
        files_count: 0,
        files_checked: 0,
        files_load: 0,
        bytes_all: 0,
        bytes_load: 0
    };
    tmp.loading = [ 1, 4,  1, 9,  1, 14,  0, 20 ];
    
    
    
    //---------------------------------------------------------------------------------------------
    //Запуск игры ---------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    
    //Запускаем сцену загрузки ресурсов
    StartScene( 'preloader', function() {
        //Добавляем прогрессбар на сцену
        game.scene.objects.progressbar.add();
    });
    
    //Включаем обновление и отрисовку объектов
    setTimeout( UpdateScene, game.delay );
    window.requestAnimationFrame( DrawScene, game.canvas.id );
    
    //Запускаем загрузкy внешних ресурсов
    LoadResources();
};

//-------------------------------------------------------------------------------------------------

//Начинаем инициализировать игровой движок, как только страница загрузилась полностью
document.onreadystatechange = function() {
    if ( document.readyState == 'complete' ) GameInit();
};
