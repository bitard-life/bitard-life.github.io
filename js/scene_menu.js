// [ Сцена: игровое меню ]
scenes.menu = {
    //Ресурсы сцены -------------------------------------------------------------------------------
    resources: {
        disclaimer:     { type: 'image', src: '/res/disclaimer.png?v=0.1' },
        rain:           { type: 'image', src: '/res/postproc/rain.png?v=0.1' },
        menu_btn:       { type: 'image', src: '/res/menu/btn.png?v=0.1' },
        settings:       { type: 'image', src: '/res/menu/settings.png?v=0.1' },
        warning:        { type: 'image', src: '/res/menu/warning.png?v=0.1' },
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
        //-----------------------------------------------------------------------------------------
        //Дисклеймер (для получения клика на запуск звука и полгого экрана) -----------------------
        //-----------------------------------------------------------------------------------------
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
                scenes.menu.layers.add( 'disclaimer' );
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
                    
                    //Нажали на Ок
                    if( pos_x > 250 && pos_x < 390 && pos_y > 300 && pos_y < 350 ) {
                        //Запускаем на весь экран
                        if( config.fullscreen ) Fullscreen();
                        
                        //Удаляем чейнджлог со сцены
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
                scenes.menu.layers.del( 'disclaimer' );
                
                //Добавляем главное меню на сцену
                scenes.menu.objects.main.add();
                
                //Удаляем созданные переменные
                delete tmp.menu.disclaimer;
            }
        },
        
        //-----------------------------------------------------------------------------------------
        //Окно настроек ---------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        settings: {
            //Добавляем объект на сцену
            add: function() {
                if( config.debug ) console.log( '[menu.settings] add' );
                
                //Создаем временные переменные
                tmp.menu.settings = {};
                
                //Сохраняем координаты мыши
                tmp.menu.settings.pos_x = game.cursor.pos_x;
                tmp.menu.settings.pos_y = game.cursor.pos_y;
                
                //Координаты окна настроек
                tmp.menu.settings.x = 180;
                tmp.menu.settings.y = 110;
                
                //Пункты настроек
                tmp.menu.settings.select = 0;
                
                //Включаем отрисовку объекта
                scenes.menu.layers.add( 'settings' );
            },
            
            //Обновляем
            update: function() {
                //Получаем короткие ссылки
                let tmp_set = tmp.menu.settings;
                let win_x = tmp.menu.settings.x;
                let win_y = tmp.menu.settings.y;
                
                
                //Захват клика
                let click = false;
                let pos_x = 0, pos_y = 0;
                if( game.cursor.pos_x === game.cursor.click_x  &&  game.cursor.pos_y === game.cursor.click_y ) {
                    //Преобразуем в кординаты холста
                    pos_x = Math.ceil( game.cursor.pos_x / game.canvas.scale );
                    pos_y = Math.ceil( game.cursor.pos_y / game.canvas.scale );
                    
                    //Детектируем клик по форме
                    if( pos_x > win_x && pos_x <  win_x + 283 && pos_y > win_y && win_y <  win_y + 225 ) {
                        click = true;
                        
                        //Клик захвачен, зануляем коордианты
                        game.cursor.click_x = 0;
                        game.cursor.click_y = 0;
                    }
                }
                
                //Обрабатываем события мыши
                if( tmp_set.pos_x !== game.cursor.pos_x || tmp_set.pos_y !== game.cursor.pos_y || click ) {
                    //Преобразуем в кординаты холста
                    if( !click ) {
                        pos_x = Math.ceil( game.cursor.pos_x / game.canvas.scale );
                        pos_y = Math.ceil( game.cursor.pos_y / game.canvas.scale );
                    }
                    
                    //Сохраняем координаты мыши
                    tmp_set.pos_x = game.cursor.pos_x;
                    tmp_set.pos_y = game.cursor.pos_y;
                    
                    //Детектируем движение на форме
                    if( pos_x > win_x && pos_x <  win_x + 283 && pos_y > win_y && win_y <  win_y + 225 ) {
                        //Пункты настроек
                        tmp_set.select = 0;
                        if( click && pos_x > win_x + 230 && pos_x < win_x + 270 && pos_y > win_y + 2 && pos_y < win_y + 22 ) {
                            //"Закрыть"
                            if( tmp.menu.settings !== undefined ) scenes.menu.objects.settings.del();
                        } else if( pos_x > win_x + 20 && pos_x < win_x + 270) {
                            if ( pos_y > win_y + 40 && pos_y < win_y + 67 ) {
                                //"Ограничить FPS"
                                tmp_set.select = 1;
                                if( click ) {
                                    config.fps_max = ( config.fps_max >= 60 ? 30 : config.fps_max + 10 );
                                    localStorage.setItem( 'fps_max', config.fps_max );
                                }
                            } else if ( pos_y > win_y + 67 && pos_y < win_y + 98 ) {
                                //"Показывать FPS"
                                tmp_set.select = 2;
                                if( click ) {
                                    config.fps_show = !config.fps_show;
                                    localStorage.setItem( 'fps_show', config.fps_show );
                                }
                            } else if ( pos_y > win_y + 98 && pos_y < win_y + 126 ) {
                                //"Постобработка"
                                tmp_set.select = 3;
                                if( click ) {
                                    config.post_proc = !config.post_proc;
                                    localStorage.setItem( 'post_proc', config.post_proc );
                                }
                            } else if ( pos_y > win_y + 126 && pos_y < win_y + 154 ) {
                                //"Во весь экран"
                                tmp_set.select = 4;
                                if( click ) {
                                    config.fullscreen = !config.fullscreen;
                                    localStorage.setItem( 'fullscreen', config.fullscreen );
                                    Fullscreen();
                                }
                            } else if ( pos_y > win_y + 154 && pos_y < win_y + 184 ) {
                                //"Разрешение"
                                tmp_set.select = 5;
                                if( click ) {
                                    config.resolution = ( config.resolution >= 3 ? 0 : config.resolution + 1 );
                                    game.canvas.resize = true;
                                    localStorage.setItem( 'resolution', config.resolution );
                                }
                            } else if ( pos_y > win_y + 184 && pos_y < win_y + 214 ) {
                                //"Громкость"
                                tmp_set.select = 6;
                                if( click ) {
                                    config.volume = ( config.volume >= 120 ? 30 : config.volume + 30 );
                                    localStorage.setItem( 'volume', config.volume );
                                }
                            }
                        }
                    }
                }
            },
            
            //Отрисовываем
            draw: function() {
                let img = scenes.menu.resources.settings.data;
                let select = tmp.menu.settings.select;
                let win_x = tmp.menu.settings.x, win_y = tmp.menu.settings.y;
                game.canvas.context.drawImage( img, 0, 0, 283, 225, win_x, win_y, 283, 225 );
                
                //"Ограничить FPS"
                game.canvas.context.drawImage( img, 
                    292 + ( select === 1 ? 110 : 0) + Math.floor( config.fps_max / 10 - 3 ) * 24, 0, 24, 15, 
                    win_x + 213, win_y + 44, 24, 15
                );
                
                //"Показывать FPS"
                game.canvas.context.drawImage( img, 
                    292 + ( select === 2 ? 110 : 0) + ( config.fps_show ? 0 : 55 ), 15, 55, 12, 
                    win_x + 216, win_y + 76, 55, 12
                );
                
                //"Постобработка"
                game.canvas.context.drawImage( img, 
                    292 + ( select === 3 ? 110 : 0) + ( config.post_proc ? 0 : 55 ), 15, 55, 12, 
                    win_x + 198, win_y + 105, 55, 12
                );
                
                //"На весь экран"
                game.canvas.context.drawImage( img, 
                    292 + ( select === 4 ? 110 : 0) + ( config.fullscreen ? 0 : 55 ), 15, 55, 12, 
                    win_x + 191, win_y + 134, 55, 12
                );
                
                //"Разрешение"
                game.canvas.context.drawImage( img, 
                    292 + ( select === 5 ? 110 : 0), 91 +  config.resolution * 20, 61, 20, 
                    win_x + 171, win_y + 160, 61, 20
                );
                
                //"Громкость"
                game.canvas.context.drawImage( img, 
                    292 + ( select === 6 ? 110 : 0), 27 +  Math.floor( config.volume / 30 - 1 ) * 16, 81, 16, 
                    win_x + 148, win_y + 192, 81, 16
                );
            },
            
            //Удаляем объект со сцены
            del: function() {
                if( config.debug ) console.log( '[menu.settings] del' );
                
                //Удаляем из списка на отрисовку
                scenes.menu.layers.del( 'settings' );
                
                //Удаляем созданные переменные
                delete tmp.menu.settings;
            }
        },
        //-----------------------------------------------------------------------------------------
        //Окно предупреждения о начале новой игры ----- -------------------------------------------
        //-----------------------------------------------------------------------------------------
        warning: {
            //Добавляем объект на сцену
            add: function() {
                if( config.debug ) console.log( '[menu.warning] add' );
                
                //Создаем временные переменные
                tmp.menu.warning = {};
                
                //Сохраняем координаты мыши
                tmp.menu.warning.pos_x = game.cursor.pos_x;
                tmp.menu.warning.pos_y = game.cursor.pos_y;
                tmp.menu.warning.click_x = game.cursor.click_x;
                tmp.menu.warning.click_y = game.cursor.click_y;
                
                //Подсветка кнопок
                tmp.menu.warning.select = 0;
                
                //Включаем отрисовку объекта
                scenes.menu.layers.add( 'warning' );
            },
            
            //Обновляем
            update: function() {
                //Получаем короткие ссылки
                let tmp_war = tmp.menu.warning;
                
                //Клик
                let click_x = tmp_war.click_x;
                let click_y = tmp_war.click_y;
                if( click_x !== game.cursor.click_x  &&  click_y !== game.cursor.click_y ) {
                    //Сохраняем координаты клика
                    click_x = game.cursor.click_x;
                    click_y = game.cursor.click_y;
                    
                    //Преобразуем в координаты холста
                    let pos_x = Math.ceil( click_x / game.canvas.scale );
                    let pos_y = Math.ceil( click_y / game.canvas.scale );
                    
                    //Пункты меню
                    if( pos_x > 185 && pos_x < 295 && pos_y > 235 && pos_y < 270 ) {
                        //"Ок"
                        scenes.menu.disable();
                        return;
                    } else if( pos_x > 350 && pos_x < 455 && pos_y > 235 && pos_y < 270 ) {
                        //"Отмена"
                        scenes.menu.objects.warning.del();
                    }
                }
                
                //Движение мыши
                if( tmp_war.pos_x !== game.cursor.pos_x || tmp_war.pos_y !== game.cursor.pos_y ) {
                    //Сохраняем координаты мыши
                    tmp_war.pos_x = game.cursor.pos_x;
                    tmp_war.pos_y = game.cursor.pos_y;
                    
                    //Преобразуем в кординаты холста
                    let pos_x = Math.ceil( tmp_war.pos_x / game.canvas.scale );
                    let pos_y = Math.ceil( tmp_war.pos_y / game.canvas.scale );
                    
                    //Пункты меню
                    tmp_war.select = 0;
                    if( pos_x > 185 && pos_x < 295 && pos_y > 235 && pos_y < 270 ) {
                        //"Ок"
                        tmp_war.select = 1;
                    } else if( pos_x > 350 && pos_x < 455 && pos_y > 235 && pos_y < 270 ) {
                        //"Отмена"
                        tmp_war.select = 2;
                    }
                }
            },
            
            //Отрисовываем
            draw: function() {
                game.canvas.context.drawImage( scenes.menu.resources.warning.data, 0, 0, 354, 148, 143, 143, 354, 148 );
                if( tmp.menu.warning.select > 0) { 
                    game.canvas.context.drawImage(
                        scenes.menu.resources.warning.data,
                        ( tmp.menu.warning.select - 1 ) * 177, 148, 177, 36,
                        ( tmp.menu.warning.select - 1 ) * 177 + 143, 143 + 91, 177, 36
                    );
                }
            },
            
            //Удаляем объект со сцены
            del: function() {
                if( config.debug ) console.log( '[menu.warning] del' );
                
                //Удаляем из списка на отрисовку
                scenes.menu.layers.del( 'warning' );
                
                //Удаляем созданные переменные
                delete tmp.menu.warning;
            }
        },
        
        //-----------------------------------------------------------------------------------------
        //Главное меню ----------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
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
                tmp.menu.main.rain_ts = tmp.draw_ts;
                game.postproc = function() {
                    tmp.menu.main.rain += Math.floor( ( tmp.draw_ts - tmp.menu.main.rain_ts ) / 2 );
                    tmp.menu.main.rain_ts = tmp.draw_ts;
                    if ( tmp.menu.main.rain > 200 ) tmp.menu.main.rain = 0;
                    game.canvas.context.drawImage( scenes.menu.resources.rain.data, 0, 200 - tmp.menu.main.rain, 640, 360, 0, 0, 640, 360 );
                };
                
                //Настраиваем движение машин [ x, y, тип авто ]
                tmp.menu.main.auto = [ [40,0,0], [349,0,1], [20,0,2], [250,0,3] ];
                tmp.menu.main.auto_ts = tmp.update_ts;
                
                //Подсветка пунктов меню
                tmp.menu.main.select = 0;
                
                //Включаем отрисовку объекта
                scenes.menu.layers.add( 'main' );
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
                    if( click_x > 15 && click_x < 140 && click_y > 275 && click_y < 290 ) {
                        //"Новая игра"
                        if( config.checkpoint > 0 ) {
                            //Выводим предупреждение о сгорании прогресса
                            if( tmp.menu.warning === undefined ) scenes.menu.objects.warning.add();
                        } else {
                            //Завершаем текущую сцену
                            scenes.menu.disable();
                            return;
                        }
                    } else if( click_x > 15 && click_x < 140 && click_y > 325 && click_y < 340 ) {
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
                        tmp_main.select = 0;
                        if( pos_x > 15 && pos_x < 140 && pos_y > 275 && pos_y < 290 ) {
                            //"Новая игра"
                            tmp_main.select = 1;
                        } else if( config.checkpoint > 0 && pos_x > 15 && pos_x < 160 && pos_y > 300 && pos_y < 315 ) {
                            //"Продолжить"
                            tmp_main.select = 2;
                        } else if( pos_x > 15 && pos_x < 140 && pos_y > 325 && pos_y < 340 ) {
                            //"Настройки"
                            tmp_main.select = 3;
                        }
                    }
                }
                
                //Движение автомобилей( 30 fps )
                if( tmp.update_ts - tmp.menu.main.auto_ts > 33.3  ) {
                    tmp.menu.main.auto_ts = tmp.update_ts;
                    
                    for( let i = 0; i < 4; i++) {
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
                context.drawImage( res.menu_btn.data,  ( config.checkpoint > 0 ? 137 : 0 ), 0, 137, 67, 20, 275, 137, 67 );
                if( tmp_main.select > 0 ) {
                    let offset = ( tmp_main.select - 1) * 24;
                    context.drawImage( res.menu_btn.data,  274, offset , 137, 19, 20, 275 + offset, 137, 19 );
                }
            },
            
            //Удаляем объект со сцены
            del: function() {
                if( config.debug ) console.log( '[menu.main] del' );
                
                //Прекращаем отрисовку объекта
                scenes.menu.layers.del( 'main' );
                
                //Выключаем фоновый звук
                scenes.menu.resources.sound_bg.stop();
                
                //Отключаем дождь
                game.postproc = function() { return; };
                
                //Удаляем созданные переменные
                delete tmp.menu.main;
            }
        }
    },
    
    //---------------------------------------------------------------------------------------------
    //Создание сцены ------------------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
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
    
    //---------------------------------------------------------------------------------------------
    //Выгрузка сцены из памяти --------------------------------------------------------------------
    //---------------------------------------------------------------------------------------------
    disable: function() {
        //Выключаем сцену
        game.scene = scenes.empty;
        
        //Удаляем окошко предупреждения
        if( tmp.menu.warning !== undefined) scenes.menu.objects.warning.del();
        
        //Удаляем меню со сцены
        scenes.menu.objects.main.del();
        
        //Выгружаем ресурсы сцены из опративной памяти
        FreeSceneMemory( scenes.menu.resources );
        
        //Удаляем созданные переменные
        delete tmp.menu;
        
        if( config.debug ) console.log( '[menu] scene disable' );
    }
};
