// [ Сцена: игровое меню ]
scenes.menu = {
    //Ресурсы сцены -------------------------------------------------------------------------------
    resources: {
        disclaimer:     { type: 'image', src: '/res/disclaimer.png?v=0.1' },
        rain:           { type: 'image', src: '/res/postproc/rain.png?v=0.1' },
        menu_btn:       { type: 'image', src: '/res/menu/btn.png?v=0.1' },
        auto:           { type: 'image', src: '/res/final/auto.png?v=0.1' },
        dorogi:         { type: 'image', src: '/res/final/dorogi.png?v=0.1' },
        krisha:         { type: 'image', src: '/res/final/krisha.png?v=0.1' },
        luji:           { type: 'image', src: '/res/final/luji.png?v=0.1' },
        anon:           { type: 'image', src: '/res/menu/anon.png?v=0.1' },
        objects:        { type: 'image', src: '/res/final/objects.png?v=0.1' },
        sound_bg:       { type: 'sound', mp3: '/res/menu/5P4C3_C4173T.mp3?v=0.1', ogg: '/res/menu/5P4C3_C4173T.ogg?v=0.1' },
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
                
                //Сохраняем координаты клика
                tmp.menu.click_x = game.cursor.click_x;
                tmp.menu.click_y = game.cursor.click_y;
                
                //Включаем отрисовку объекта
                scenes.menu.layers.push( 'disclaimer' );
            },
            
            //Отрисовываем
            draw: function() {
                 //Рисуем дисклеймер 
                game.canvas.context.drawImage( scenes.menu.resources.disclaimer.data, 0, 0 );
                
                //Кликнули
                if( tmp.menu.click_x != game.cursor.click_x  &&  tmp.menu.click_y != game.cursor.click_y ) {
                    tmp.menu.click_x = Math.ceil( game.cursor.click_x / game.canvas.scale );
                    tmp.menu.click_y = Math.ceil( game.cursor.click_y / game.canvas.scale );
                    
                    if( tmp.menu.click_x > 250 && tmp.menu.click_x < 390 && tmp.menu.click_y > 300 && tmp.menu.click_y < 350 ) {
                        //Удаляем чейнджлог со сцены
                        scenes.menu.objects.disclaimer.del();
                    }
                    
                    tmp.menu.click_x = game.cursor.click_x;
                    tmp.menu.click_y = game.cursor.click_y;
                } 
            },
            
            //Удаляем объект со сцены
            del: function() {
                if( config.debug ) console.log( '[menu.disclaimer] del' );
                
                //Прекращаем отрисовку объекта
                let obj_pos = scenes.menu.layers.indexOf( 'disclaimer' );
                if( obj_pos > -1 ) scenes.menu.layers.splice( obj_pos, 1 );
                
                //Добавляем меню на сцену
                scenes.menu.objects.menu.add();
            }
        },
        //Дороги
        menu: {
            //Добавляем объект на сцену
            add: function() {
                if( config.debug ) console.log( '[menu.menu] add' );
                
                //Включаем отрисовку объекта
                scenes.menu.layers.push( 'menu' );
                
                //Запускаем фоновый звук
                scenes.menu.resources.sound_bg.play( 0, 0 );
                
                //Запускаем дождь
                tmp.menu.rain = 0;
                game.postproc = function() {
                    tmp.menu.rain += 20;
                    if ( tmp.menu.rain > 200 ) tmp.menu.rain = 0;
                    game.canvas.context.drawImage( scenes.menu.resources.rain.data, 0, 200 - tmp.menu.rain, 640, 360, 0, 0, 640, 360 );
                };
                
                //Настраиваем движение машин [ x, y, тип авто ]
                tmp.menu.auto = [ [40,0,0], [349,0,1], [20,0,2], [250,0,3] ];
                tmp.menu.x = 600;
                tmp.menu.y = 330;
            },
            
            auto: function() {
                for( let i = 0; i<4; i++) {
                    let x = tmp.menu.auto[ i ][ 0 ];
                    x += ( tmp.menu.auto[ i ][ 2 ] > 1 ? -1 : 1 );
                    
                    //Движение закончилось
                    if( x == 380 || x == 0 ) {
                        //Сбрасываем координату
                        x = ( tmp.menu.auto[ i ][ 2 ] > 1 ? 380 - Math.round(Math.random()) * 6 : 0 + Math.round(Math.random()) * 6 );
                        //Ставим случайную тачку
                        tmp.menu.auto[ i ][ 2 ] = Math.round(Math.random()) + ( tmp.menu.auto[ i ][ 2 ] > 1 ? 2 : 0 );
                    }
                    
                    //Обновляем координаты
                    tmp.menu.auto[ i ][ 0 ] = x;
                    tmp.menu.auto[ i ][ 1 ] = 520 - Math.ceil( x * 0.75 );
                }
            },
            
            //Отрисовываем объекты в меню
            draw: function() {
                //Получаем короткие ссылки
                let context = game.canvas.context;
                let tmp_lob = tmp.menu;
                let res = scenes.menu.resources;
                
                context.fillStyle = '#000000';
                context.fillRect( 0, 0, game.canvas.width, game.canvas.height );
                
                context.drawImage( res.dorogi.data, 155, 62, 640, 360, 0, 0, 640, 360 );
                
                //Костыль движения авто
                scenes.menu.objects.menu.auto();
                for( let x = 0; x < 4; x++ ) {
                    context.drawImage(
                        res.auto.data,
                        tmp.menu.auto[ x ][ 2 ] * 50, 0,
                        50, 44,
                        666 - tmp.menu.auto[ x ][ 0 ],
                        tmp.menu.auto[ x ][ 1 ] + ( tmp.menu.auto[ x ][ 2 ] > 1 ? 20 : -10 ) - 280,
                        50, 44
                    );
                }
                
                
                context.drawImage( res.objects.data, 155-31, 62+56, 640, 360, 0, 0, 640, 360 );
                context.drawImage( res.krisha.data,  155+121, 62-256, 640, 360, 0, 0, 640, 360 );
                context.drawImage( res.luji.data,  155-250, 62-328, 640, 360, 0, 0, 640, 360 );
                context.drawImage( res.anon.data,  155-464, 62-282, 640, 360, 0, 0, 640, 360 );
            },
            
            //Удаляем объект со сцены
            del: function() {
                if( config.debug ) console.log( '[menu.menu] del' );
                
                //Прекращаем отрисовку объекта
                let obj_pos = scenes.menu.layers.indexOf( 'menu' );
                if( obj_pos > -1 ) scenes.menu.layers.splice( obj_pos, 1 );
                
                //Выключаем фоновый звук
                scenes.menu.resources.sound_bg.stop();
                
                //Отключаем дождь
                game.postproc = scenes.empty;
            }
        }
    },
    //Создание сцены ------------------------------------------------------------------------------
    enable: function() {
        if( config.debug ) console.log( '[menu] scene enable' );
        //Создаем временные переменные для сцены
        tmp.menu = {};
        
        //Запускаем отрисовку сцены загрузки
        game.draw = scenes.loading;
        
        //Загружаем ресурсы сцены в опративную память
        LoadSceneMemory( scenes.menu.resources, function() {
            //Добавляем чейнджлог на сцену
            scenes.menu.objects.disclaimer.add();
            
            //Запускаем отрисовку сцены
            game.draw = scenes.menu.update;
        } );
    },
    
    //Обновление сцены ----------------------------------------------------------------------------
    update: function() {
        let context = game.canvas.context;
        
        context.clearRect( 0, 0, game.canvas.width, game.canvas.height );
        
        //Рисуем объекты сцены
        for( let i = 0; i < scenes.menu.layers.length; i++ ) {
            scenes.menu.objects[ scenes.menu.layers[ i ] ].draw();
        }
    },
    
    //Выгрузка сцены из памяти --------------------------------------------------------------------
    disable: function() {
    }
};
