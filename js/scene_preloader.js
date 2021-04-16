// [ Сцена: загрузка файлов ]
scenes.preloader = {
    //Ресурсы сцены -------------------------------------------------------------------------------
    resources: {
        logo: { type: 'image64', file: 
            'data:image/png;base64,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'
        }
    },
    //Слои сцены ----------------------------------------------------------------------------------
    layers: [],
    
    //Объекты сцены -------------------------------------------------------------------------------
    objects: {
        //Полоса прогресса закачки
        progressbar: {
            //Добавляем объект на сцену
            add: function() {
                if( config.debug ) console.log( '[preloader.pogressbar] add' );
                
                //Включаем отрисовку объекта
                scenes.preloader.layers.push( 'progressbar' );
                
                //Инициалищируем переменные
                tmp.preloader.progressbar = {};
                scenes.preloader.objects.progressbar.update();
            },
            
            //Обновляем объект
            update: function() {
                //Получаем короткие ссылки
                let tmp_pre = tmp.preloader;
                let tmp_prog = tmp.preloader.progressbar;
                let res = scenes.preloader.resources;

                //Обновляем лого
                tmp_prog.dx = Math.ceil( ( game.canvas.width / 2) - ( res.logo.data.width / 2) );
                tmp_prog.dy = Math.ceil( ( game.canvas.height / 2) - ( res.logo.data.height / 2 ) - 10 );
                
                //Обновляем контур прогрессбара
                tmp_prog.barW = Math.ceil( ( game.canvas.width / 100) * 80 );
                tmp_prog.barX = Math.ceil( ( game.canvas.width - tmp_prog.barW ) / 2 );
                tmp_prog.barY = Math.ceil( game.canvas.height  / 2 ) + ( res.logo.data.height / 2 ) - 10;
                    
                //Вычисляем, сколько процентов загружено
                if( tmp_pre.bytes_load > 0 ) tmp_prog.precentage = Math.ceil( 100 / ( tmp_pre.bytes_all / tmp_pre.bytes_load ) );
                
                //Файлы загрузились
                if( tmp.preloader.files_load == tmp.preloader.files_count ) {
                    //Завершаем текущую сцену
                    scenes.preloader.disable();
                    
                    //Запускаем сцену меню
                    scenes.menu.enable();
                }
            },
            
            //Отрисовываем объект
            draw: function() {
                //Получаем короткие ссылки
                let context = game.canvas.context;
                let tmp_pre = tmp.preloader;
                let tmp_prog = tmp.preloader.progressbar;
                let res = scenes.preloader.resources;
                    
                //Очищаем холст
                context.fillStyle = '#888888';
                context.clearRect( 0, 0, game.canvas.width, game.canvas.height );
                
                //Рисуем лого
                context.drawImage( res.logo.data, tmp_prog.dx, tmp_prog.dy );
                
                //Рисуем контур прогрессбара
                context.fillStyle = '#222222';
                context.fillRect( tmp_prog.barX, tmp_prog.barY, tmp_prog.barW, 20 );
                    
                //Рисуем полосу прогресса
                if( tmp_pre.bytes_load > 0 ) {
                    context.fillStyle = '#888888';
                    context.fillRect(
                        tmp_prog.barX + 5,
                        tmp_prog.barY + 5,
                        ( ( tmp_prog.barW - 10 ) / 100 ) * tmp_prog.precentage,
                        10
                    );
                }
            },
            
            //Удаляем объект со сцены
            del: function() {
                //Удаляем из списка на отрисовку
                if( config.debug ) console.log( '[preloader.pogressbar] del' );
                let obj_pos = scenes.preloader.layers.indexOf( 'progressbar' );
                if( obj_pos > -1 ) scenes.preloader.layers.splice( obj_pos, 1 );
                
                //Удаляем временные переменные
                delete tmp.preloader.progressbar;
            }
        }
    },
    
    //Создание сцены ------------------------------------------------------------------------------
    enable: function() {
        if( config.debug ) console.log( '[preloader] scene enable' );
        
        //Создаем временные переменные для сцены
        let tmp_pre = tmp.preloader = {};
        
        //Ограничиваем сцену до ~4 fps
        tmp_pre.prev_fps = config.fps_max;
        config.fps_max = 4;
        
        //Список ресурсов к скачиванию: [ { src: '/../xxx.xxx', ref: [ { scene: 'scene_name', name: 'res_name' }, ... ] }, ... ]
        tmp_pre.resources = [],
        
        //Ищем ресурсы во всех сценах
        tmp_pre.scene_names = Object.getOwnPropertyNames( scenes );
        for( let s = 0; s < tmp_pre.scene_names.length; s++ ) {
            //У сцены нашлись ресурсы на скачивание
            if( scenes[ tmp_pre.scene_names[ s ] ].resources !== undefined ) {
                //Перебираем ресурсы и заносим их в список для скачивания
                let scene_res = scenes[ tmp_pre.scene_names[ s ] ].resources;
                let scene_res_names = Object.getOwnPropertyNames( scene_res );
                for( let r = 0; r < scene_res_names.length; r++ ) {
                    let scene_resource = scene_res[ scene_res_names[ r ] ];
                    
                    //Поверяем, загружен ли уже ресурс
                    if( scene_resource.file !== undefined ) break;
                    
                    //Для звука переключаем на поддерживаемый формат
                    if( scene_resource.type == 'sound' ) scene_resource.src = ( game.mp3_sound ? scene_resource.mp3 : scene_resource.ogg );
                    
                    //Поверяем, есть ли уже в списке на закачку такой ресурс
                    let res_find = false;
                    for( let t = 0; t < tmp_pre.resources.length; t++ ) {
                        if( tmp_pre.resources[ t ].src == scene_resource.src ) {
                            //Сохраняем ссылку на ресурс для этой сцены (случай с одним ресурсом на несколько сцен)
                            tmp_pre.resources[ t ].ref.push( { scene: tmp_pre.scene_names[ s ], name: scene_res_names[ r ] } );
                            res_find = true;
                            break;
                        }
                    }
                    
                    if( res_find === false ) {
                        //Добавляем ресурс в список на закачку
                        tmp_pre.resources.push( { src: scene_resource.src, ref:[ { scene: tmp_pre.scene_names[ s ], name: scene_res_names[ r ] } ] } );
                    }
                }
            }
        }
        
        //Количество файлов к скачиванию
        tmp_pre.files_count = tmp_pre.resources.length;
        
        //Файлов чекнуто через HEAD
        tmp_pre.files_checked = 0;
        
        //Файлов загружено
        tmp_pre.files_load = 0;
        
        //Общее количество байт на скачивание
        tmp_pre.bytes_all = 0;
        
        //Байт скачано
        tmp_pre.bytes_load = 0;
        
        //Загружаем ресурсы сцены в оперативную память
        LoadSceneMemory( scenes.preloader.resources, function() {
            //Добавляем прогрессбар на сцену
            scenes.preloader.objects.progressbar.add();
            
            //Запускаем сцену
            game.scene = scenes.preloader;
        } );
        
        //Оцениваем размеры ресурсных файлов, через http-заголовок HEAD
        for( let i = 0; i < tmp_pre.files_count; i++ ) {
            let xhr = new XMLHttpRequest();
            xhr.open( 'HEAD', tmp_pre.resources[ i ].src, true );
            xhr.onreadystatechange = function() {
                if( this.readyState == this.DONE ) {
                    //Получаем и сохраняем размер файла
                    let file_size = parseInt( xhr.getResponseHeader( 'Content-Length' ) );
                    tmp_pre.resources[ i ].size = file_size;
                    
                    //Увеличиваем счетчик общего количества байт для скачивания
                    tmp_pre.bytes_all += file_size;
                    
                    //Увеличиваем счетчик чекнутых файлов
                    tmp_pre.files_checked++;
                    
                    if( config.debug ) console.log( '[preloader] file checked ' + tmp_pre.files_checked + '/' + tmp_pre.files_count + ': ' + tmp_pre.resources[ i ].src );
                }
            };
            xhr.send();
        }
        
        //Ждем завершения оценки размеров файлов
        let timerHead = setInterval( function() {
            if( tmp_pre.files_count  === tmp_pre.files_checked ) {
                clearInterval( timerHead );
                
                //Начинаем скачивать файлы ресурсов
                for( let j = 0; j < tmp_pre.files_count; j++ ) {
                    let xhr = new XMLHttpRequest();
                    xhr.open( 'GET', tmp_pre.resources[ j ].src, true );
                    xhr.responseType = 'arraybuffer';
                    //if( tmp_pre.resources[ j ].src.substr(-3) == 'mp3' || tmp_pre.resources[ j ].src.substr(-3) == 'ogg' ) xhr.responseType = 'blob';
                    
                     //Сохраняем в объекте запроса количество скачанных байт
                    xhr.loaded = 0;
                    
                    xhr.onprogress = function( e ) {
                        //Обновляем общее количество скачанных байт
                        tmp_pre.bytes_load += e.loaded - this.loaded;
                        this.loaded = e.loaded;
                    };
                    
                    xhr.onload = function( e ) {
                        //На случай кеширования файлов
                        tmp_pre.bytes_load += tmp_pre.resources[ j ].size - this.loaded;
                        
                        //Сохраняем массив байт в объект ресурсов сцены
                        for( let k = 0; k < tmp_pre.resources[ j ].ref.length; k++ ) {
                            let scene_name = tmp_pre.resources[ j ].ref[ k ].scene;
                            let res_name = tmp_pre.resources[ j ].ref[ k ].name;
                            
                            scenes[ scene_name ].resources[ res_name ].file = this.response;
                        }
                        
                        //Увеличиваем счетчик загруженных файлов
                        tmp_pre.files_load++;
                        
                        if( config.debug ) console.log( '[preloader] file loaded ' + tmp_pre.files_load + '/' + tmp_pre.files_count + ': ' + tmp_pre.resources[ j ].src );
                    };
                    
                    xhr.send();
                }
            }
        }, 500 );
    },
    
    //Выгрузка сцены из памяти --------------------------------------------------------------------
    disable: function() {
        //Выключаем сцену
        game.scene = scenes.empty;
        
        //Возвращаем прежний fps
        config.fps_max = tmp.preloader.prev_fps;
        
        //Удаляем прогрессбар со сцены
        scenes.preloader.objects.progressbar.del();
        
        //Выгружаем ресурсы сцены из опративной памяти
        FreeSceneMemory( scenes.preloader.resources );
        
        //Удаляем созданные переменные
        let tmp_pre = tmp.preloader;
        delete tmp_pre.prev_fps;
        delete tmp_pre.res_names;
        delete tmp_pre.files_count;
        delete tmp_pre.files_checked;
        delete tmp_pre.files_load;
        delete tmp_pre.bytes_all;
        delete tmp_pre.bytes_load;
        
        if( config.debug ) console.log( '[preloader] scene disable' );
    }
};
