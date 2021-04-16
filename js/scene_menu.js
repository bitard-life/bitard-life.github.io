// [ Сцена: игровое меню ]
scenes.menu = {
    //Ресурсы сцены -------------------------------------------------------------------------------
    resources: {
        disclaimer:     { type: 'image', src: '/res/disclaimer.png?v=0.1' },
        rain:           { type: 'image', src: '/res/postproc/rain.png?v=0.1' },
        menu_btn:       { type: 'image', src: '/res/menu/btn.png?v=0.1' },
        settings:       { type: 'image', src: '/res/menu/settings.png?v=0.1' },
        auto:           { type: 'image', src: '/res/final/auto.png?v=0.1' },
        dorogi:         { type: 'image', src: '/res/final/dorogi.png?v=0.1' },
        krisha:         { type: 'image', src: '/res/final/krisha.png?v=0.1' },
        luji:           { type: 'image', src: '/res/final/luji.png?v=0.1' },
        anon:           { type: 'image', src: '/res/menu/anon.png?v=0.1' },
        objects:        { type: 'image', src: '/res/final/objects.png?v=0.1' },
        sound_bg:       { type: 'sound', mp3: '/res/menu/5P4C3_C4173T.mp3?v=0.2', ogg: '/res/menu/5P4C3_C4173T.ogg?v=0.2' },
       //sound_step:     { type: 'sound', mp3: '/res/final/step_dkiller2204.mp3?v=0.1', ogg: '/res/final/step_dkiller2204.ogg?v=0.1' }
    },
    
    //Слои сцены ----------------------------------------------------------------------------------
    layers: [],
    
    //Объекты сцены -------------------------------------------------------------------------------
    objects: {
        //Дисклеймер (для получения клика на запуск звука)
        disclaimer: {
            //Добавляем объект на сцену
            add: function() {
                if( config.debug ) console.log( '[menu.disclaimer] add' );
                
                //Создаем временные переменные
                tmp.menu.disclaimer = {};
                
                //Сохраняем координаты клика
                tmp.menu.disclaimer.click_x = game.cursor.click_x;
                tmp.menu.disclaimer.click_y = game.cursor.click_y;
                
                //Сжатие дисклеймера
                tmp.menu.disclaimer.compress = 0;
                
                //Включаем отрисовку объекта
                scenes.menu.layers.push( 'disclaimer' );
            },
            
            //Обновляем
            update: function() {
                //Сжатие дисклеймера
                let diff = game.canvas.scale * game.canvas.height - window.innerHeight;
                tmp.menu.disclaimer.compress = ( diff > 40 ? Math.floor( diff / 3 ) : 0 );
                
                //Кликнули
                let click_x = tmp.menu.disclaimer.click_x;
                let click_y = tmp.menu.disclaimer.click_y;
                if( click_x !== game.cursor.click_x  &&  click_y !== game.cursor.click_y ) {
                    //Сохраняем координаты клика
                    click_x = game.cursor.click_x;
                    click_y = game.cursor.click_y;
                    
                    //Преобразуем в координаты холста
                    let pos_x = Math.ceil( click_x / game.canvas.scale );
                    let pos_y = Math.ceil( click_y / game.canvas.scale );
                    
                    //Удаляем чейнджлог со сцены при попадании на кнопку
                    if( pos_x > 250 && pos_x < 390 && pos_y > 300 && pos_y < 350 ) {
                        scenes.menu.objects.disclaimer.del();
                    }
                }
            },
            
            //Отрисовываем
            draw: function() {
                 //Рисуем дисклеймер
                if( tmp.menu.disclaimer.compress === 0 ) {
                    game.canvas.context.drawImage( scenes.menu.resources.disclaimer.data, 0, 0 );
                } else {
                    game.canvas.context.drawImage( scenes.menu.resources.disclaimer.data, 170, 20, 300, 50, 170, 20 + tmp.menu.disclaimer.compress, 300, 50 );
                    game.canvas.context.drawImage( scenes.menu.resources.disclaimer.data, 22, 106, 594, 152, 22, 106 + Math.floor( tmp.menu.disclaimer.compress / 2), 594, 152 );
                    game.canvas.context.drawImage( scenes.menu.resources.disclaimer.data, 250, 300, 140, 40, 250, 300, 140, 40 );
                }
            },
            
            //Удаляем объект со сцены
            del: function() {
                if( config.debug ) console.log( '[menu.disclaimer] del' );
                
                //Удаляем из списка на отрисовку
                let obj_pos = scenes.menu.layers.indexOf( 'disclaimer' );
                if( obj_pos > -1 ) scenes.menu.layers.splice( obj_pos, 1 );
                
                //Добавляем главное меню на сцену
                scenes.menu.objects.main.add();
                
                //Удаляем созданные переменные
                delete tmp.menu.disclaimer;
            }
        },
        
        //Окно настроек
        settings: {
            //Добавляем объект на сцену
            add: function() {
                if( config.debug ) console.log( '[menu.settings] add' );
                
                //Создаем временные переменные
                tmp.menu.settings = {};
                
                //Сохраняем координаты мыши
                tmp.menu.settings.pos_x = game.cursor.pos_x;
                tmp.menu.settings.pos_y = game.cursor.pos_y;
                tmp.menu.settings.click_x = game.cursor.click_x;
                tmp.menu.settings.click_y = game.cursor.click_y;
                
                //Включаем отрисовку объекта
                scenes.menu.layers.push( 'settings' );
            },
            
            //Обновляем
            update: function() {
                //Получаем короткие ссылки
                let tmp_set = tmp.menu.settings;
                
                //Клик
                if( tmp_set.click_x !== game.cursor.click_x || tmp_set.click_y !== game.cursor.click_y ) {
                    //Преобразуем в кординаты холста
                    let click_x = Math.ceil( game.cursor.click_x / game.canvas.scale );
                    let click_y = Math.ceil( game.cursor.click_y / game.canvas.scale );
                    
                    //Пункты настроек
                    if( click_x > 400 && click_x < 460 && click_y > 80 && click_y < 110 ) {
                        //"Закрыть"
                        if( tmp.menu.settings !== undefined ) scenes.menu.objects.settings.del();
                    } else if( click_x > 200 && click_x < 450) {
                        if ( click_y > 120 && click_y < 150 ) {
                            //"Ограничить FPS"
                            switch( config.fps_max ) {
                                case 30:
                                    config.fps_max = 40;
                                    break;
                                case 40:
                                    config.fps_max = 50;
                                    break;
                                case 50:
                                    config.fps_max = 60;
                                    break;
                                case 60:
                                    config.fps_max = 30;
                                    break;
                                case 60:
                                default:
                                    config.fps_max = 30;
                                    break;
                            }
                        } else if ( click_y > 150 && click_y < 178 ) {
                            //"Показывать FPS"
                            config.fps_show = ( config.fps_show ? false : true );
                        } else if ( click_y > 178 && click_y < 208 ) {
                            //"Постобработка"
                            config.post_proc = ( config.post_proc ? false : true );
                        } else if ( click_y > 208 && click_y < 237 ) {
                            //"На весь экран"
                            Fullscreen();
                        } else if ( click_y > 237 && click_y < 265 ) {
                            //"Громкость"
                            switch( config.volume ) {
                                case 30:
                                    config.volume = 60;
                                    break;
                                case 60:
                                    config.volume = 100;
                                    break;
                                case 100:
                                    config.volume = 150;
                                    break;
                                case 150:
                                default:
                                    config.volume = 30;
                                    break;
                            }
                        }
                    }
                    
                    //Обнуляем координаты клика (чтоб отличать нажатия)
                    tmp_set.click_x = game.cursor.click_x = 0;
                    tmp_set.click_y = game.cursor.click_y = 0;
                }
                
                //Движение мыши
                if( tmp_set.pos_x !== game.cursor.pos_x || tmp_set.pos_y !== game.cursor.pos_y ) {
                    //Сохраняем координаты мыши
                    tmp_set.pos_x = game.cursor.pos_x;
                    tmp_set.pos_y = game.cursor.pos_y;
                    
                    //Преобразуем в кординаты холста
                    let pos_x = Math.ceil( tmp_set.pos_x / game.canvas.scale );
                    let pos_y = Math.ceil( tmp_set.pos_y / game.canvas.scale );
                    
                    //Пункты меню
                    /*if( pos_x > 15 && pos_x < 140 && pos_y > 275 && pos_y < 290 ) {
                        //"Новая игра"
                        tmp_main.select = 1;
                    } else if( game.checkpoint > 0 && pos_x > 15 && pos_x < 160 && pos_y > 300 && pos_y < 315 ) {
                        //"Продолжить"
                        tmp_main.select = 2;
                    } else if( pos_x > 15 && pos_x < 140 && pos_y > 325 && pos_y < 340 ) {
                        //"Настройки"
                        tmp_main.select = 3;
                    } else {
                        tmp_main.select = 0;
                    }*/
                }
            },
            
            //Отрисовываем
            draw: function() {
                let tmp_var = 0;
                game.canvas.context.drawImage( scenes.menu.resources.settings.data, 0, 0, 285, 201, 178, 80, 285, 201 );
                
                //"Ограничить FPS"
                switch( config.fps_max ) {
                    case 30:
                    default:
                        tmp_var = 0;
                        break;
                    case 40:
                        tmp_var = 1;
                        break;
                    case 50:
                        tmp_var = 2;
                        break;
                    case 60:
                        tmp_var = 3;
                        break;
                }
                if( tmp_var > 0) game.canvas.context.drawImage( scenes.menu.resources.settings.data, 255 + tmp_var*30, 0, 30, 22, 385, 118, 30, 22 );
                
                //"Показывать FPS"
                if( config.fps_show ) game.canvas.context.drawImage( scenes.menu.resources.settings.data, 286, 23, 68, 23, 388, 150, 68, 23 );
                
                //"Постобработка"
                if( config.post_proc === false ) game.canvas.context.drawImage( scenes.menu.resources.settings.data, 211, 71, 63, 23, 371, 180, 63, 23 );
                
                //"На весь экран"
                
                //"Громкость"
                switch( config.volume ) {
                    case 30:
                        tmp_var = 46;
                        break;
                    case 60:
                    default:
                        tmp_var = 0;
                        break;
                    case 100:
                        tmp_var = 69;
                        break;
                    case 150:
                        tmp_var = 92;
                        break;
                }
                if( tmp_var > 0) game.canvas.context.drawImage( scenes.menu.resources.settings.data, 286, tmp_var, 96, 22, 323, 237, 96, 22 );
            },
            
            //Удаляем объект со сцены
            del: function() {
                if( config.debug ) console.log( '[menu.settings] del' );
                
                //Удаляем из списка на отрисовку
                let obj_pos = scenes.menu.layers.indexOf( 'settings' );
                if( obj_pos > -1 ) scenes.menu.layers.splice( obj_pos, 1 );
                
                //Удаляем созданные переменные
                delete tmp.menu.settings;
            }
        },
        
        //Главное меню
        main: {
            //Добавляем объект на сцену
            add: function() {
                if( config.debug ) console.log( '[menu.main] add' );
                
                //Создаем временные переменные
                tmp.menu.main = {};
                
                //Сохраняем координаты мыши
                tmp.menu.main.pos_x = game.cursor.pos_x;
                tmp.menu.main.pos_y = game.cursor.pos_y;
                tmp.menu.main.click_x = game.cursor.click_x;
                tmp.menu.main.click_y = game.cursor.click_y;
                
                //Запускаем фоновый звук
                scenes.menu.resources.sound_bg.play( 0, 0 );
                
                //Запускаем дождь через постобработку
                tmp.menu.main.rain = 0;
                game.postproc = function() {
                    tmp.menu.main.rain += 20;
                    if ( tmp.menu.main.rain > 200 ) tmp.menu.main.rain = 0;
                    game.canvas.context.drawImage( scenes.menu.resources.rain.data, 0, 200 - tmp.menu.main.rain, 640, 360, 0, 0, 640, 360 );
                };
                
                //Настраиваем движение машин [ x, y, тип авто ]
                tmp.menu.main.auto = [ [40,0,0], [349,0,1], [20,0,2], [250,0,3] ];
                
                //Пункты меню
                tmp.menu.main.select = 0;
                tmp.menu.main.selected = 0;
                
                //Включаем отрисовку объекта
                scenes.menu.layers.push( 'main' );
            },
            
            //Обновляем
            update: function() {
                //Получаем короткие ссылки
                let tmp_main = tmp.menu.main;
                
                //Клик
                if( tmp_main.click_x !== game.cursor.click_x || tmp_main.click_y !== game.cursor.click_y ) {
                    //Сохраняем координаты клика
                    tmp_main.click_x = game.cursor.click_x;
                    tmp_main.click_y = game.cursor.click_y;
                        
                    //Преобразуем в кординаты холста
                    let click_x = Math.ceil( tmp_main.click_x / game.canvas.scale );
                    let click_y = Math.ceil( tmp_main.click_y / game.canvas.scale );
                    
                    //Пункты меню
                    if( click_x > 15 && click_x < 140 && click_y > 325 && click_y < 340 ) {
                        //"Настройки"
                        if( tmp.menu.settings === undefined ) scenes.menu.objects.settings.add();
                    }
                }
                
                //Движение мыши
                if( tmp_main.pos_x !== game.cursor.pos_x || tmp_main.pos_y !== game.cursor.pos_y ) {
                    //Сохраняем координаты мыши
                    tmp_main.pos_x = game.cursor.pos_x;
                    tmp_main.pos_y = game.cursor.pos_y;
                    
                    //Преобразуем в кординаты холста
                    let pos_x = Math.ceil( tmp_main.pos_x / game.canvas.scale );
                    let pos_y = Math.ceil( tmp_main.pos_y / game.canvas.scale );
                    
                    //Пункты меню
                    if( tmp.menu.settings === undefined ) {
                        if( pos_x > 15 && pos_x < 140 && pos_y > 275 && pos_y < 290 ) {
                            //"Новая игра"
                            tmp_main.select = 1;
                        } else if( game.checkpoint > 0 && pos_x > 15 && pos_x < 160 && pos_y > 300 && pos_y < 315 ) {
                            //"Продолжить"
                            tmp_main.select = 2;
                        } else if( pos_x > 15 && pos_x < 140 && pos_y > 325 && pos_y < 340 ) {
                            //"Настройки"
                            tmp_main.select = 3;
                        } else {
                            tmp_main.select = 0;
                        }
                    }
                }
                
                //Движение автомобилей
                for( let i = 0; i<4; i++) {
                    let x = tmp_main.auto[ i ][ 0 ];
                    x += ( tmp_main.auto[ i ][ 2 ] > 1 ? -1 : 1 );
                    
                    //Движение закончилось
                    if( x == 380 || x == 0 ) {
                        //Сбрасываем координату
                        x = ( tmp_main.auto[ i ][ 2 ] > 1 ? 380 - Math.round(Math.random()) * 6 : 0 + Math.round(Math.random()) * 6 );
                        //Ставим случайную тачку
                        tmp_main.auto[ i ][ 2 ] = Math.round(Math.random()) + ( tmp_main.auto[ i ][ 2 ] > 1 ? 2 : 0 );
                    }
                    
                    //Обновляем координаты
                    tmp_main.auto[ i ][ 0 ] = x;
                    tmp_main.auto[ i ][ 1 ] = 520 - Math.ceil( x * 0.75 );
                }
            },
            
            //Отрисовываем
            draw: function() {
                //Получаем короткие ссылки
                let context = game.canvas.context;
                let tmp_main = tmp.menu.main;
                let res = scenes.menu.resources;
                
                context.fillStyle = '#000000';
                context.fillRect( 0, 0, game.canvas.width, game.canvas.height );
                
                context.drawImage( res.dorogi.data, 155, 62, 640, 360, 0, 0, 640, 360 );
                
                //Движение авто
                for( let x = 0; x < 4; x++ ) {
                    context.drawImage(
                        res.auto.data,
                        tmp_main.auto[ x ][ 2 ] * 50, 0,
                        50, 44,
                        666 - tmp_main.auto[ x ][ 0 ],
                        tmp_main.auto[ x ][ 1 ] + ( tmp_main.auto[ x ][ 2 ] > 1 ? 20 : -10 ) - 280,
                        50, 44
                    );
                }
                
                context.drawImage( res.objects.data, 155-31, 62+56, 640, 360, 0, 0, 640, 360 );
                context.drawImage( res.krisha.data,  155+121, 62-256, 640, 360, 0, 0, 640, 360 );
                context.drawImage( res.luji.data,  155-250, 62-328, 640, 360, 0, 0, 640, 360 );
                
                //Сидящий анон
                context.drawImage( res.anon.data,  0, 0, 53, 135, 309, 219, 53, 135 );
                
                //Пункты меню
                context.drawImage( res.menu_btn.data,  ( game.checkpoint > 0 ? 137 : 0 ), 0, 137, 67, 20, 275, 137, 67 );
                if( tmp_main.select > 0 ) {
                    let offset = ( tmp_main.select - 1) * 24;
                    context.drawImage( res.menu_btn.data,  274, offset , 137, 19, 20, 275 + offset, 137, 19 );
                }
            },
            
            //Удаляем объект со сцены
            del: function() {
                if( config.debug ) console.log( '[menu.main] del' );
                
                //Прекращаем отрисовку объекта
                let obj_pos = scenes.menu.layers.indexOf( 'main' );
                if( obj_pos > -1 ) scenes.menu.layers.splice( obj_pos, 1 );
                
                //Выключаем фоновый звук
                scenes.menu.resources.sound_bg.stop();
                
                //Отключаем дождь
                game.postproc = function() { return; };
                
                //Удаляем созданные переменные
                delete tmp.menu.main;
            }
        }
    },
    
    //Создание сцены ------------------------------------------------------------------------------
    enable: function() {
        if( config.debug ) console.log( '[menu] scene enable' );
        //Создаем временные переменные для сцены
        tmp.menu = {};
        
        //Запускаем сцену загрузки, пока инициализируются ресурсы игры
        game.scene = scenes.loading;
        
        //Загружаем ресурсы сцены в опративную память
        LoadSceneMemory( scenes.menu.resources, function() {
            //Добавляем чейнджлог на сцену
            scenes.menu.objects.disclaimer.add();
            
            //Запускаем сцену
            game.scene = scenes.menu;
        } );
    },
    
    //Выгрузка сцены из памяти --------------------------------------------------------------------
    disable: function() {
        //Выключаем сцену
        game.scene = scenes.empty;
        
        //Выгружаем ресурсы сцены из опративной памяти
        FreeSceneMemory( scenes.menu.resources );
        
        if( config.debug ) console.log( '[preloader] menu disable' );
    }
};
