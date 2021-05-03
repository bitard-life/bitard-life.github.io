// [ Сцена: игровое меню ]
scenes.menu = {
    //Инициализация сцены -------------------------------------------------------------------------
    init: function() {
        //Добавляем дисклеймер на сцену
        game.scene.objects.disclaimer.add();
        
        //Запускаем постобработку
        game.scene.objects.postproc.enable();
    },
    
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
                    hide_y: 0
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                
                //Сжатие дисклеймера по вертикали
                let diff = game.canvas.height - window.innerHeight / game.canvas.scale;
                ltmp.hide_y = ( diff > 26 ? Math.floor( diff - 26 ) : 0 );
                
                //Проверяем наличие клика на кнопке
                if( ClickDetect( 250, 300, 140, 50 ) ) {
                    //Удаляем дисклеймер со сцены
                    game.scene.objects.disclaimer.del();
                        
                    //Добавляем бэкграунд
                    game.scene.objects.background.add();
                    game.scene.objects.background.tmp.x = game.scene.objects.background.tmp.width - game.canvas.width;
                        
                    //Добавляем меню
                    game.scene.objects.menu.add();
                        
                    //Добавляем анона
                    game.scene.objects.anon.add();
                    
                    //Добавляем дождь
                    game.scene.objects.rain.add();
                        
                    //Включаем редактирование опорных точек анона
                    //utilities.points_editor.add( game.scene.objects.anon );
                        
                    //Включаем полный экран (если так было сохранено в конфиге)
                    Fullscreen();
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                
                 //Рисуем дисклеймер
                if( ltmp.hide_y === 0 ) {
                    //Целиком
                    game.canvas.context.drawImage( ltmp.img_dis, 0, 0 );
                } else {
                    //Частями
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
        //Импорт дождя из финала ------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        rain: scenes.final.objects.rain,
        
        //-----------------------------------------------------------------------------------------
        //Импорт постобработки --------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        postproc: scenes.other.objects.postproc,
        
        //-----------------------------------------------------------------------------------------
        //Меню ------------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        menu: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {
                buttons:  { type: 'image', src: '/res/menu/btn.png' },
                roof:     { type: 'image', src: '/res/final/roof.png' },
                sound_bg: { type: 'sound', mp3: '/res/menu/5P4C3_C4173T.mp3', ogg: '/res/menu/5P4C3_C4173T.ogg' }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    img_btn: game.scene.objects.menu.resources.buttons.data,
                    img_roof: game.scene.objects.menu.resources.roof.data,
                    pos_x: game.cursor.pos_x,
                    pos_y: game.cursor.pos_y,
                    anon_rand_anim: Math.floor( Math.random() * 10 ) * Math.floor( 1000 / game.delay ),
                    select: 0
                };
                //Запускаем фоновый звук
                this.resources.sound_bg.play( 0, 0 );
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let pos_x = game.cursor.pos_x;
                let pos_y = game.cursor.pos_y;
                
                //Если открыты сторонние окна, игнорируем
                if( game.scene.objects.settings.tmp !== undefined  || game.scene.objects.warning.tmp !== undefined ) return;
                
                //Проверяем наличие клика на объекте
                let click = ClickDetect( 0, 0, game.canvas.width, game.canvas.height );
                
                //Движение мыши
                if( ltmp.pos_x !== pos_x || ltmp.pos_y !== pos_y || click ) {
                    //Сохраняем координаты мыши
                    ltmp.pos_x = pos_x;
                    ltmp.pos_y = pos_y;
                    
                    //Снимаем выделение
                    ltmp.select = 0;
                    
                    //Работа с координатами
                    if( pos_x > 20 && pos_x < 140 && pos_y > 275 && pos_y < 295 ) {
                        //"Новая игра"
                        ltmp.select = 1;
                        if( click ) {
                            if( config.checkpoint > 0 ) {
                                //Выводим предупреждение о сгорании прогресса
                                game.scene.objects.warning.add();
                            } else {
                                //Запускаем сцену десткого сада
                                StartScene( 'kindergarten' );
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
                
                //Случайные движения анона
                ltmp.anon_rand_anim--;
                if( ltmp.anon_rand_anim < 0 ) {
                    //Выбираем случайное время для следующего движения
                    ltmp.anon_rand_anim = ( 4 + Math.floor( Math.random() * 10 ) ) * Math.floor( 1000 / game.delay );
                    
                    //Выбираем случайное движение ( 1 или 2 фаза )
                    game.scene.objects.anon.play(
                        game.scene.objects.anon.animations.menu, 
                        1000, 
                        false, 
                        Math.floor( Math.random() * 2 ) + 1,
                        1,
                        0
                    );
                    
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
                sett_window: { type: 'image', src: '/res/menu/settings.png' }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    x: Math.floor( ( game.canvas.width - 360 ) / 2 ),
                    y: game.canvas.hidden_h + Math.floor( ( game.canvas.height - game.canvas.hidden_h - 257 ) / 2 ),
                    w: 360,
                    h: 257,
                    img_sett: game.scene.objects.settings.resources.sett_window.data,
                    hidden_h: game.canvas.hidden_h,
                    pos_x: game.cursor.pos_x,
                    pos_y: game.cursor.pos_y,
                    fullscreen: ( config.fullscreen ? 29 : 0),
                    post_proc: ( config.post_proc ? 29 : 0),
                    resolution: 348 + config.resolution * 29,
                    fps_max: 203 + Math.floor( config.fps_max / 10 - 2 ) * 29,
                    fps_nofix: ( config.fps_nofix ? 29 : 0),
                    fps_show: ( config.fps_show ? 29 : 0 ),
                    sound_volume: 58 + Math.floor( config.sound_volume / 33 ) * 29
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                
                //Автовыравнивание по вертикали
                if( ltmp.hidden_h !== game.canvas.hidden_h ) {
                    ltmp.hidden_h = game.canvas.hidden_h;
                    ltmp.y = game.canvas.hidden_h + Math.floor( ( game.canvas.height - game.canvas.hidden_h - ltmp.h ) / 2 );
                }
                
                //Определяем текущую конфигурацию
                ltmp.fullscreen = ( config.fullscreen ? 29 : 0);
                ltmp.post_proc = ( config.post_proc ? 29 : 0);
                ltmp.resolution = 348 + config.resolution * 29;
                ltmp.fps_max = 203 + Math.floor( config.fps_max / 10 - 2 ) * 29;
                ltmp.fps_nofix = ( config.fps_nofix ? 29 : 0);
                ltmp.fps_show = ( config.fps_show ? 29 : 0);
                ltmp.sound_volume = 58 + Math.floor( config.sound_volume / 33 ) * 29;
                
                //Проверяем наличие клика на объекте
                let pos_x = game.cursor.pos_x;
                let pos_y = game.cursor.pos_y;
                let win_x = ltmp.x, win_y = ltmp.y, win_w = ltmp.w, win_h = ltmp.h;
                let direction;
                if( ClickDetect( win_x, win_y, win_w, win_h ) ) {
                    if( pos_x > win_x + 300 && pos_x < win_x + 350 && pos_y > win_y && pos_y < win_y + 25 ) {
                        //"Закрыть"
                        this.del();
                    } else if ( pos_y > win_y + 43 && pos_y < win_y + 43 + 20 ) {
                        //"Во весь экран"
                        direction = ( config.fullscreen ? 0 : 110 );
                        if( pos_x > win_x + 214 + direction && pos_x < win_x + 240 + direction ) {
                            config.fullscreen = !config.fullscreen;
                            localStorage.setItem( 'fullscreen', config.fullscreen );
                            Fullscreen();
                        }
                    } else if ( pos_y > win_y + 43 + 29 && pos_y < win_y + 43 + 29 + 20 ) {
                        //"Постобработка"
                        direction = ( config.post_proc ? 0 : 110 );
                        if( pos_x > win_x + 214 + direction && pos_x < win_x + 240 + direction ) {
                            config.post_proc = !config.post_proc;
                            localStorage.setItem( 'post_proc', config.post_proc );
                        }
                    } else if ( pos_y > win_y + 43 + 29*2 && pos_y < win_y + 43 + 29*2 + 20 ) {
                        //"Масштаб экрана"
                        if( pos_x > win_x + 214 && pos_x < win_x + 240 &&  config.resolution >= 1 ) {
                            config.resolution--;
                            game.canvas.resize = true;
                            localStorage.setItem( 'resolution', config.resolution );
                        } else if( pos_x > win_x + 214 + 110 && pos_x < win_x + 240 + 110 &&  config.resolution <= 2 ) {
                            config.resolution++;
                            game.canvas.resize = true;
                            localStorage.setItem( 'resolution', config.resolution );
                        }
                    } else if ( pos_y > win_y + 43 + 29*3 && pos_y < win_y + 43 + 29*3 + 20 ) {
                        //"Ограничить FPS"
                        if( pos_x > win_x + 214 && pos_x < win_x + 240 &&  config.fps_max >= 30 ) {
                            config.fps_max -= 10;
                            localStorage.setItem( 'fps_max', config.fps_max );
                        } else if( pos_x > win_x + 214 + 110 && pos_x < win_x + 240 + 110 &&  config.fps_max <= 50 ) {
                            config.fps_max += 10;
                            localStorage.setItem( 'fps_max', config.fps_max );
                        }
                    } else if ( pos_y > win_y + 43 + 29*4 && pos_y < win_y + 43 + 29*4 + 20 ) {
                        //"Плавающий FPS"
                        direction = ( config.fps_nofix ? 0 : 110 );
                        if( pos_x > win_x + 214 + direction && pos_x < win_x + 240 + direction ) {
                            config.fps_nofix = !config.fps_nofix;
                            localStorage.setItem( 'fps_nofix', config.fps_nofix );
                            
                            //Переключаемся на requestAnimationFrame
                            if( config.fps_nofix === true ) tmp.reqAnimFrame = false;
                        }
                    } else if ( pos_y > win_y + 43 + 29*5 && pos_y < win_y + 43 + 29*5 + 20 ) {
                        //"Показывать FPS"
                        direction = ( config.fps_show ? 0 : 110 );
                        if( pos_x > win_x + 214 + direction && pos_x < win_x + 240 + direction ) {
                            config.fps_show = !config.fps_show;
                            localStorage.setItem( 'fps_show', config.fps_show );
                        }
                    } else if ( pos_y > win_y + 43 + 29*6 && pos_y < win_y + 43 + 29*6 + 20 ) {
                        //"Громкость игры"
                        if( pos_x > win_x + 214 && pos_x < win_x + 240 &&  config.sound_volume >= 33 ) {
                            config.sound_volume -= 33;
                            localStorage.setItem( 'sound_volume', config.sound_volume );
                        } else if( pos_x > win_x + 214 + 110 && pos_x < win_x + 240 + 110 &&  config.sound_volume <= 99 ) {
                            config.sound_volume += 33;
                            localStorage.setItem( 'sound_volume', config.sound_volume );
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
                let btn_x = ltmp.x + 221;
                let btn_y = ltmp.y + 39;
                
                //Рисуем чистое окно
                context.drawImage( img_sett, 0,0, 360,257, ltmp.x,ltmp.y, 360,257 );
                
                //"Во весь экран"
                context.drawImage( img_sett, 360,ltmp.fullscreen,   122,29, btn_x,btn_y,        122,29 );
                
                //"Постобработка"
                context.drawImage( img_sett, 360,ltmp.post_proc,    122,29, btn_x,btn_y + 29,   122,29 );
                
                //"Масштаб экрана"
                context.drawImage( img_sett, 360,ltmp.resolution,   122,29, btn_x,btn_y + 29*2, 122,29 );
                
                //"Ограничить FPS"
                context.drawImage( img_sett, 360,ltmp.fps_max,      122,29, btn_x,btn_y + 29*3, 122,29 );
                
                //"Плавающий FPS"
                context.drawImage( img_sett, 360,ltmp.fps_nofix,    122,29, btn_x,btn_y + 29*4, 122,29 );
                
                //"Показывать FPS"
                context.drawImage( img_sett, 360,ltmp.fps_show,     122,29, btn_x,btn_y + 29*5, 122,29 );
                
                //"Громкость игры"
                context.drawImage( img_sett, 360,ltmp.sound_volume, 122,29, btn_x,btn_y + 29*6, 122,29 );
            }
        },
        
        //-----------------------------------------------------------------------------------------
        //Окно предупреждения о начале новой игры -------------------------------------------------
        //-----------------------------------------------------------------------------------------
        warning: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {
                warn_window: { type: 'image', src: '/res/menu/warning.png' }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    x: Math.floor( ( game.canvas.width - 354 ) / 2 ),
                    y: game.canvas.hidden_h + Math.floor( ( game.canvas.height - game.canvas.hidden_h - 148 ) / 2 ),
                    w: 354,
                    h: 148,
                    img_warn: game.scene.objects.warning.resources.warn_window.data,
                    pos_x: game.cursor.pos_x,
                    pos_y: game.cursor.pos_y,
                    select: 0
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let pos_x = game.cursor.pos_x;
                let pos_y = game.cursor.pos_y;
                let win_x = ltmp.x, win_y = ltmp.y, win_w = ltmp.w, win_h = ltmp.h;
                
                //Проверяем наличие клика на объекте
                let click = ClickDetect( win_x, win_y, win_w, win_h );
                
                //Движение мыши
                if( ltmp.pos_x !== pos_x || ltmp.pos_y !== pos_y || click ) {
                    //Сохраняем координаты мыши
                    ltmp.pos_x = pos_x;
                    ltmp.pos_y = pos_y;
                    
                    //Работа с координатами
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
                                StartScene( 'kindergarten' );
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
