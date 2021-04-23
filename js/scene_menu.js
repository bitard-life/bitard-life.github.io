// [ Сцена: игровое меню ]
scenes.menu = {
    //Объекты сцены -------------------------------------------------------------------------------
    objects: {
        //-----------------------------------------------------------------------------------------
        //Дисклеймер (для получения клика на запуск звука и полного экрана) -----------------------
        //-----------------------------------------------------------------------------------------
        disclaimer: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {
                disclaimer: { type: 'image', src: '/res/disclaimer.png' }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    img_dis: game.scene.objects.disclaimer.resources.disclaimer.data,
                    hide_y: 0,
                    click_x: game.cursor.click_x,
                    click_y: game.cursor.click_y
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                
                //Сжатие дисклеймера по вертикали
                let diff = game.canvas.height - window.innerHeight / game.canvas.scale;
                ltmp.hide_y = ( diff > 26 ? Math.floor( diff - 26 ) : 0 );
                
                //Клик
                if( ltmp.click_x !== game.cursor.click_x || ltmp.click_y !== game.cursor.click_y ) {
                    //Сохраняем координаты клика
                    ltmp.click_x = game.cursor.click_x;
                    ltmp.click_y = game.cursor.click_y;
                    
                    //Преобразуем в координаты холста
                    let click_x = Math.ceil( ltmp.click_x / game.canvas.scale );
                    let click_y = Math.ceil( ltmp.click_y / game.canvas.scale );
                    
                    //Нажали на Ок
                    if( click_x > 250 && click_x < 390 && click_y > 300 && click_y < 350 ) {
                        //Удаляем дисклеймер со сцены
                        game.scene.objects.disclaimer.del();
                        
                        //Добавляем бэкграунд
                        game.scene.objects.background.add();
                        game.scene.objects.background.tmp.x = game.scene.objects.background.tmp.width - game.canvas.width;
                        
                        //Добавляем меню
                        game.scene.objects.menu.add();
                        
                        //Добавляем анона
                        //game.scene.objects.anon.add();
                        
                        //Включаем полный экран (если так было сохранено в конфиге)
                        Fullscreen();
                    }
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                
                 //Рисуем дисклеймер
                if( ltmp.hide_y === 0 ) {
                    game.canvas.context.drawImage( ltmp.img_dis, 0, 0 );
                } else {
                    game.canvas.context.drawImage( ltmp.img_dis,   0, 20,  640, 50,    0, 20 + ltmp.hide_y, 640, 50 );
                    game.canvas.context.drawImage( ltmp.img_dis,   0, 106, 640, 152,   0, 106 + Math.floor( ltmp.hide_y / 2), 640, 152 );
                    game.canvas.context.drawImage( ltmp.img_dis,   0, 300, 640, 40,    0, 300, 640, 40 );
                }
            }
        },
        
        //-----------------------------------------------------------------------------------------
        //Импорт бэкграунда из финала -------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        background: scenes.final.objects.background,
        
        //-----------------------------------------------------------------------------------------
        //Импорт анона из финала ------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        anon: scenes.final.objects.anon,
        
        //-----------------------------------------------------------------------------------------
        //Импорт редактора анимаций----------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        body_editor: scenes.utilities.objects.body_editor,
        
        //-----------------------------------------------------------------------------------------
        //Меню ------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        menu: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {
                buttons:  { type: 'image', src: '/res/menu/btn.png' },
                roof:     { type: 'image', src: '/res/final/roof.png' },
                rain:     { type: 'image', src: '/res/postproc/rain.png' },
                sound_bg: { type: 'sound', mp3: '/res/menu/5P4C3_C4173T.mp3', ogg: '/res/menu/5P4C3_C4173T.ogg' }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    img_btn: game.scene.objects.menu.resources.buttons.data,
                    img_roof: game.scene.objects.menu.resources.roof.data,
                    mouse_x:   game.cursor.pos_x,
                    mouse_y:   game.cursor.pos_y,
                    select: 0
                };
                //Запускаем фоновый звук
                this.resources.sound_bg.play( 0, 0 );
                
                //Запускаем дождь через постобработку
                tmp.rain = 0;
                tmp.rain_ts = tmp.draw_ts;
                game.postproc = function() {
                    tmp.rain += Math.floor( ( tmp.draw_ts - tmp.rain_ts ) / 2 );
                    tmp.rain_ts = tmp.draw_ts;
                    if ( tmp.rain > 200 ) tmp.rain = 0;
                    game.canvas.context.drawImage( game.scene.objects.menu.resources.rain.data, 0, 200 - tmp.rain, 640, 360, 0, 0, 640, 360 );
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let click = false;
                let pos_x = 0, pos_y = 0;
                
                //Если открыты сторонние окна, игнорируем
                if( game.scene.objects.settings.tmp !== undefined  || game.scene.objects.warning.tmp !== undefined ) return;
                
                //Клик
                if( game.cursor.pos_x === game.cursor.click_x  &&  game.cursor.pos_y === game.cursor.click_y ) {
                    //Преобразуем в кординаты холста
                    pos_x = Math.ceil( game.cursor.pos_x / game.canvas.scale );
                    pos_y = Math.ceil( game.cursor.pos_y / game.canvas.scale );
                    
                    //Детектируем клик по объекту
                    click = true;
                        
                    //Клик захвачен, зануляем коордианты
                    game.cursor.click_x = 0;
                    game.cursor.click_y = 0;
                }
                
                //Движение мыши
                if( ltmp.mouse_x !== game.cursor.pos_x || ltmp.mouse_x !== game.cursor.pos_y || click ) {
                    //Преобразуем в кординаты холста
                    if( !click ) {
                        pos_x = Math.ceil( game.cursor.pos_x / game.canvas.scale );
                        pos_y = Math.ceil( game.cursor.pos_y / game.canvas.scale );
                    }
                    
                    //Сохраняем координаты мыши
                    ltmp.mouse_x = game.cursor.pos_x;
                    ltmp.mouse_x = game.cursor.pos_y;
                    
                    //Обрабатываем движение мыши
                    ltmp.select = 0;
                    if( pos_x > 20 && pos_x < 140 && pos_y > 275 && pos_y < 295 ) {
                        //"Новая игра"
                        ltmp.select = 1;
                        if( click ) {
                            if( config.checkpoint > 0 ) {
                                //Выводим предупреждение о сгорании прогресса
                                game.scene.objects.warning.add();
                            } else {
                                //Запускаем сцену десткого сада
                                StartScene( 'kindergarten', function() {
                                    
                                });
                            }
                        }
                    } else if( config.checkpoint > 0 && pos_x > 20 && pos_x < 160 && pos_y > 298 && pos_y < 320 ) {
                        //"Продолжить"
                        ltmp.select = 2;
                    } else if( pos_x > 20 && pos_x < 140 && pos_y > 323 && pos_y < 343 ) {
                        //"Настройки"
                        ltmp.select = 3;
                        
                        if( click ) game.scene.objects.settings.add();
                    }
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let context = game.canvas.context;
                
                //Крыша
                context.drawImage( ltmp.img_roof,  276,0, 640,360,  0,194, 640,360 );
                
                //Пункты меню
                context.drawImage( ltmp.img_btn,  ( config.checkpoint > 0 ? 137 : 0 ), 0, 137, 67, 20, 275, 137, 67 );
                if( ltmp.select > 0 ) {
                    let offset = ( ltmp.select - 1) * 24;
                    context.drawImage( ltmp.img_btn,  274, offset , 137, 19, 20, 275 + offset, 137, 19 );
                }
            }
        },
        
        //-----------------------------------------------------------------------------------------
        //Окно настроек ---------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        settings: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {
                window: { type: 'image', src: '/res/menu/settings.png' }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    x: Math.floor( ( game.canvas.width - 283 ) / 2 ),
                    y: game.canvas.hidden_h + Math.floor( ( game.canvas.height - game.canvas.hidden_h - 225 ) / 2 ),
                    w: 283,
                    h: 225,
                    img_sett: game.scene.objects.settings.resources.window.data,
                    hidden_h: game.canvas.hidden_h,
                    mouse_x:   game.cursor.pos_x,
                    mouse_y:   game.cursor.pos_y,
                    select: 0
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let click = false;
                let pos_x = 0, pos_y = 0;
                let win_x = ltmp.x, win_y = ltmp.y, win_w = ltmp.w, win_h = ltmp.h;
                
                //Автовыравнивание по вертикали
                if( ltmp.hidden_h !== game.canvas.hidden_h ) {
                    ltmp.hidden_h = game.canvas.hidden_h;
                    ltmp.y = game.canvas.hidden_h + Math.floor( ( game.canvas.height - game.canvas.hidden_h - win_h ) / 2 );
                }
                
                //Клик
                if( game.cursor.pos_x === game.cursor.click_x  &&  game.cursor.pos_y === game.cursor.click_y ) {
                    //Преобразуем в кординаты холста
                    pos_x = Math.ceil( game.cursor.pos_x / game.canvas.scale );
                    pos_y = Math.ceil( game.cursor.pos_y / game.canvas.scale );
                    
                    //Детектируем клик по объекту
                    if( pos_x > win_x && pos_x <  win_x + win_w && pos_y > win_y && win_y <  win_y + win_h ) {
                        click = true;
                        
                        //Клик захвачен, зануляем коордианты
                        game.cursor.click_x = 0;
                        game.cursor.click_y = 0;
                    }
                }
                
                //Движение мыши
                if( ltmp.mouse_x !== game.cursor.pos_x || ltmp.mouse_x !== game.cursor.pos_y || click ) {
                    //Преобразуем в кординаты холста
                    if( !click ) {
                        pos_x = Math.ceil( game.cursor.pos_x / game.canvas.scale );
                        pos_y = Math.ceil( game.cursor.pos_y / game.canvas.scale );
                    }
                    
                    //Сохраняем координаты мыши
                    ltmp.mouse_x = game.cursor.pos_x;
                    ltmp.mouse_x = game.cursor.pos_y;
                    
                    //Обрабатываем движение мыши
                    if( pos_x > win_x && pos_x <  win_x + win_w && pos_y > win_y && win_y <  win_y + win_h ) {
                        //Пункты настроек
                        ltmp.select = 0;
                        if( click && pos_x > win_x + 230 && pos_x < win_x + 270 && pos_y > win_y + 2 && pos_y < win_y + 22 ) {
                            //"Закрыть"
                            this.del();
                        } else if( pos_x > win_x + 20 && pos_x < win_x + 270) {
                            if ( pos_y > win_y + 40 && pos_y < win_y + 67 ) {
                                //"Ограничить FPS"
                                ltmp.select = 1;
                                if( click ) {
                                    config.fps_max = ( config.fps_max >= 60 ? 30 : config.fps_max + 10 );
                                    localStorage.setItem( 'fps_max', config.fps_max );
                                }
                            } else if ( pos_y > win_y + 67 && pos_y < win_y + 98 ) {
                                //"Показывать FPS"
                                ltmp.select = 2;
                                if( click ) {
                                    config.fps_show = !config.fps_show;
                                    localStorage.setItem( 'fps_show', config.fps_show );
                                }
                            } else if ( pos_y > win_y + 98 && pos_y < win_y + 126 ) {
                                //"Постобработка"
                                ltmp.select = 3;
                                if( click ) {
                                    config.post_proc = !config.post_proc;
                                    localStorage.setItem( 'post_proc', config.post_proc );
                                }
                            } else if ( pos_y > win_y + 126 && pos_y < win_y + 154 ) {
                                //"Во весь экран"
                                ltmp.select = 4;
                                if( click ) {
                                    config.fullscreen = !config.fullscreen;
                                    localStorage.setItem( 'fullscreen', config.fullscreen );
                                    Fullscreen();
                                }
                            } else if ( pos_y > win_y + 154 && pos_y < win_y + 184 ) {
                                //"Разрешение"
                                ltmp.select = 5;
                                if( click ) {
                                    config.resolution = ( config.resolution >= 3 ? 0 : config.resolution + 1 );
                                    game.canvas.resize = true;
                                    localStorage.setItem( 'resolution', config.resolution );
                                }
                            } else if ( pos_y > win_y + 184 && pos_y < win_y + 214 ) {
                                //"Громкость"
                                ltmp.select = 6;
                                if( click ) {
                                    config.volume = ( config.volume >= 120 ? 30 : config.volume + 30 );
                                    localStorage.setItem( 'volume', config.volume );
                                }
                            }
                        }
                    }
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let context = game.canvas.context;
                let img_sett = ltmp.img_sett;
                let select = ltmp.select;
                let win_x = ltmp.x, win_y = ltmp.y;
                
                //Рисуем чистое окно
                context.drawImage( img_sett, 0, 0, 283, 225, win_x, win_y, 283, 225 );
                
                //"Ограничить FPS"
                context.drawImage( img_sett, 
                    292 + ( select === 1 ? 110 : 0) + Math.floor( config.fps_max / 10 - 3 ) * 24, 0, 24, 15, 
                    win_x + 213, win_y + 44, 24, 15
                );
                
                //"Показывать FPS"
                context.drawImage( img_sett, 
                    292 + ( select === 2 ? 110 : 0) + ( config.fps_show ? 0 : 55 ), 15, 55, 12, 
                    win_x + 216, win_y + 76, 55, 12
                );
                
                //"Постобработка"
                context.drawImage( img_sett, 
                    292 + ( select === 3 ? 110 : 0) + ( config.post_proc ? 0 : 55 ), 15, 55, 12, 
                    win_x + 198, win_y + 105, 55, 12
                );
                
                //"На весь экран"
                context.drawImage( img_sett, 
                    292 + ( select === 4 ? 110 : 0) + ( config.fullscreen ? 0 : 55 ), 15, 55, 12, 
                    win_x + 191, win_y + 134, 55, 12
                );
                
                //"Разрешение"
                context.drawImage( img_sett, 
                    292 + ( select === 5 ? 110 : 0), 91 +  config.resolution * 20, 61, 20, 
                    win_x + 171, win_y + 160, 61, 20
                );
                
                //"Громкость"
                context.drawImage( img_sett, 
                    292 + ( select === 6 ? 110 : 0), 27 +  Math.floor( config.volume / 30 - 1 ) * 16, 81, 16, 
                    win_x + 148, win_y + 192, 81, 16
                );
            }
        },
        
        //-----------------------------------------------------------------------------------------
        //Окно предупреждения о начале новой игры -------------------------------------------------
        //-----------------------------------------------------------------------------------------
        warning: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {
                window: { type: 'image', src: '/res/menu/warning.png' }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    x: Math.floor( ( game.canvas.width - 354 ) / 2 ),
                    y: game.canvas.hidden_h + Math.floor( ( game.canvas.height - game.canvas.hidden_h - 148 ) / 2 ),
                    w: 354,
                    h: 148,
                    img_warn: game.scene.objects.warning.resources.window.data,
                    mouse_x: game.cursor.pos_x,
                    mouse_y: game.cursor.pos_y,
                    select: 0
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let click = false;
                let pos_x = 0, pos_y = 0;
                let win_x = ltmp.x, win_y = ltmp.y, win_w = ltmp.w, win_h = ltmp.h;
                
                //Клик
                if( game.cursor.pos_x === game.cursor.click_x  &&  game.cursor.pos_y === game.cursor.click_y ) {
                    //Преобразуем в кординаты холста
                    pos_x = Math.ceil( game.cursor.pos_x / game.canvas.scale );
                    pos_y = Math.ceil( game.cursor.pos_y / game.canvas.scale );
                    
                    //Детектируем клик по объекту
                    if( pos_x > win_x && pos_x <  win_x + win_w && pos_y > win_y && win_y <  win_y + win_h ) {
                        click = true;
                        
                        //Клик захвачен, зануляем коордианты
                        game.cursor.click_x = 0;
                        game.cursor.click_y = 0;
                    }
                }
                
                //Движение мыши
                if( ltmp.mouse_x !== game.cursor.pos_x || ltmp.mouse_x !== game.cursor.pos_y || click ) {
                    //Преобразуем в кординаты холста
                    if( !click ) {
                        pos_x = Math.ceil( game.cursor.pos_x / game.canvas.scale );
                        pos_y = Math.ceil( game.cursor.pos_y / game.canvas.scale );
                    }
                    
                    //Сохраняем координаты мыши
                    ltmp.mouse_x = game.cursor.pos_x;
                    ltmp.mouse_x = game.cursor.pos_y;
                    
                    //Обрабатываем движение мыши
                    if( pos_x > win_x && pos_x <  win_x + win_w && pos_y > win_y && win_y <  win_y + win_h ) {
                        //Кнопки окна
                        ltmp.select = 0;
                        if( pos_x > win_x + 40 && pos_x < win_x + 150 && pos_y > win_y + 92  && pos_y < win_y + 126  ) {
                            //"Ок"
                            ltmp.select = 1;
                            if( click ) {
                                //Очищаем прогресс
                                config.checkpoint = 0;
                                
                                //Запускаем сцену десткого сада
                                StartScene( 'kindergarten', function() {
                                    
                                });
                            }
                        } else if( pos_x > win_x + 206 && pos_x < win_x + 316 && pos_y > win_y + 92  && pos_y < win_y + 126  ) {
                            //"Отмена"
                            ltmp.select = 2;
                            if( click ) this.del();
                        }
                    }
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let context = game.canvas.context;
                let img_warn = ltmp.img_warn;
                let select = ltmp.select;
                let win_x = ltmp.x, win_y = ltmp.y;
                
                //Отрисовка окна
                context.drawImage( img_warn, 0, 0, 354, 148, win_x, win_y, 354, 148 );
                
                //Выделение кнопок
                if( select > 0) { 
                    game.canvas.context.drawImage( img_warn,  ( select - 1 ) * 177, 148, 177, 36, ( select - 1 ) * 177 + win_x, win_y + 91, 177, 36 );
                }
            }
        }
    }
};
