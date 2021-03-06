// [ Сцена: финал на крыше ]
scenes.final = {
    //Объекты сцены -------------------------------------------------------------------------------
    objects: {
        //-----------------------------------------------------------------------------------------
        //Фон сцены -------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        background: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {
                autos:   { type: 'image', src: '/res/final/autos.png' },
                street:  { type: 'image', src: '/res/final/street.png' },
                objects: { type: 'image', src: '/res/final/objects.png' }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    x: 0, y:0,
                    width: game.scene.objects.background.resources.street.data.width,
                    img_auto: game.scene.objects.background.resources.autos.data,
                    img_street: game.scene.objects.background.resources.street.data,
                    img_objects: game.scene.objects.background.resources.objects.data,
                    
                    autos: {
                        show: false,
                        step: 0.0,
                        position: 0,
                        delay: 1,
                        // [ x, y, тип авто, смещение от соседа, полоса ]
                        arr:  [ [0,0,0,140,0], [0,0,1,280,0], [0,0,2,80,1], [0,0,3,250,0] ]
                    }
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let autos = ltmp.autos;
                let offset_x = ltmp.x;
                let offset_y = ltmp.y;
                let autos_x = 0;
                let autos_y = 0;
                
                //Движение машин
                if( offset_x + game.canvas.width < ltmp.width - 350 ) {
                    autos.show = false;
                } else {
                    autos.show = true;
                    autos_x = ltmp.width - offset_x - 375;
                    autos_y = -40;
                    
                    //Анимация( 15 сек - 500px )
                    if( autos.delay !== game.delay ) {
                        autos.delay = game.delay;
                        autos.step =  ( 500 * autos.delay ) / 15000;
                    }
                    autos.position += autos.step;
                    if( autos.position >= 500.0) autos.position = 0.0;
                    
                    for( let i = 0, x = 0, y = 0; i < 4; i++) {
                        //Положение + смещение по "х"
                        x = Math.floor( autos.position + autos.arr[ i ][ 3 ] ) % 500;
                        y = Math.floor( x * 0.75 );
                        
                        //Движение закончилось
                        if( x === 499 ) {
                            //Ставим случайную тачку
                            autos.arr[ i ][ 2 ] = Math.round(Math.random()) + ( autos.arr[ i ][ 2 ] > 1 ? 2 : 0 );
                            //Ставим случайную полосу
                            autos.arr[ i ][ 4 ] = Math.floor(Math.random() * 2); 
                        }
                        
                        //Обновляем координаты
                        if( autos.arr[ i ][ 2 ] > 1 ) {
                            autos.arr[ i ][ 0 ] = autos_x + x - ( autos.arr[ i ][ 4 ] === 0 ? 0 : 30 );
                            autos.arr[ i ][ 1 ] = autos_y + y;
                        } else {
                            autos.arr[ i ][ 0 ] = autos_x + 535 - x;
                            autos.arr[ i ][ 1 ] = autos_y + 375 - y;
                        }
                    }
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let context = game.canvas.context;
                let offset_x = ltmp.x;
                let offset_y = ltmp.y;
                
                //Заливаем фон черным
                context.fillStyle = 'rgb(0,0,0)';
                context.fillRect( 0, 0, game.canvas.width, game.canvas.height );
                
                //Рисуем улицу
                context.drawImage( ltmp.img_street, offset_x,offset_y, 640,360,   0,0, 640,360 );
                
                //Рисуем автомобили
                if( ltmp.autos.show ) {
                    for( let i = 0, dx = 0, dy = 0; i < 4; i++ ) {
                        context.drawImage( ltmp.img_auto, 
                            ltmp.autos.arr[ i ][ 2 ] * 50, 0, 50, 44, 
                            ltmp.autos.arr[ i ][ 0 ], ltmp.autos.arr[ i ][ 1 ],  50, 44
                        );
                    }
                }
                
                //Рисуем объекты на улице
                context.drawImage( ltmp.img_objects, offset_x,offset_y, 640,360,   0,0, 640,360 );
            }
        },
    
        //-----------------------------------------------------------------------------------------
        //Игрок -----------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        anon: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {},
            
            //Анимации объекта --------------------------------------------------------------------
            animations: {
                menu: [
                    [
                        [255,255,255,255,1000],
                        [0,0,0,0,255,107,126,99,120,96,125,96,131,114,132,114,126,109,124,106,123,104,119],
                        [1,0,0,0,255,93,93,68,86,82,95,89,97,97,104,97,121,105,121,109,98,106,90,91,82,80,76],
                        [0,0,0,0,255,97,131,91,123,89,128,88,134,98,135,106,136,108,132,106,129,97,126,94,123],
                        [1,0,0,0,255,82,97,72,80,87,90,101,98,104,106,103,116,100,127,89,124,91,113,89,105,76,101,63,96,60,89],
                        [0,0,0,0,255,73,62,65,33,58,68,59,89,64,93,73,90,81,84,86,77,87,58,87,32],
                        [0,0,0,0,255,80,22,95,6,78,3,64,11,63,26,60,35,79,42,90,34,93,22,95,6],
                        [0,0,0,0,255,94,6,94,6,86,11,74,12,64,11,74,12,86,11,81,28,79,42,81,28,86,11],
                        [0,255,255,255,255,90,22,91,19,89,20,89,24,91,23],
                        [0,255,255,255,255,85,25,86,22,85,22,84,27,86,26]
                    ],
                    [
                        [255,255,255,255,1000],
                        [0,0,0,0,255,107,126,101,121,100,126,101,132,119,128,117,122,112,122,109,122,106,118],
                        [1,0,0,0,255,93,93,68,86,82,95,89,97,97,104,97,121,105,121,109,98,106,90,91,82,80,76],
                        [0,0,0,0,255,97,131,91,123,89,128,88,134,98,135,106,136,108,132,106,129,97,126,94,123],
                        [1,0,0,0,255,82,97,72,80,87,90,101,98,104,106,103,116,100,127,89,124,91,113,89,105,76,101,63,96,60,89],
                        [0,0,0,0,255,73,62,65,33,58,68,59,89,64,93,73,90,81,84,86,77,87,58,87,32],
                        [0,0,0,0,255,80,22,95,6,78,3,64,11,63,26,60,35,79,42,90,34,93,22,95,6],
                        [0,0,0,0,255,94,6,94,6,86,11,74,12,64,11,74,12,86,11,81,28,79,42,81,28,86,11],
                        [0,255,255,255,255,90,22,91,19,89,20,89,24,91,23],
                        [0,255,255,255,255,85,25,86,22,85,22,84,27,86,26]
                    ],
                    [
                        [255,255,255,255,1000],
                        [0,0,0,0,255,99,126,98,117,93,121,92,127,108,133,110,127,106,124,103,122,103,118],
                        [1,0,0,0,255,93,93,68,86,82,95,89,97,97,104,95,120,103,122,108,99,104,90,91,82,80,76],
                        [0,0,0,0,255,103,128,96,123,96,129,97,135,107,132,115,130,115,125,112,123,103,124,99,122],
                        [1,0,0,0,255,82,97,72,80,87,90,100,99,104,106,105,116,107,124,97,126,93,116,89,105,76,101,63,96,60,89],
                        [0,0,0,0,255,73,62,65,33,58,68,59,89,64,93,73,90,81,84,86,77,87,58,87,32],
                        [0,0,0,0,255,80,22,95,6,78,3,64,11,63,26,60,35,79,42,90,34,93,22,95,6],
                        [0,0,0,0,255,94,6,94,6,86,11,74,12,64,11,74,12,86,11,81,28,79,42,81,28,86,11],
                        [0,255,255,255,255,90,22,91,19,89,20,89,24,91,23],
                        [0,255,255,255,255,85,25,86,22,85,22,84,27,86,26]
                    ]
                ],
                hand: [
                    [
                        [255,255,255,255,100],
                        [0,0,0,0,255,74,124,74,117,70,117,68,124,68,128,73,134,77,132,77,128,78,122],
                        [1,0,0,0,255,74,72,81,69,67,67,68,79,67,89,67,94,68,102,68,112,68,119,77,118,78,107,79,97,80,86,81,78]
                    ],
                    [
                        [255,255,255,255,100],
                        [0,0,0,0,255,74,94,74,87,70,87,68,94,68,98,73,104,77,102,77,98,78,92],
                        [1,0,0,0,255,74,72,80,71,67,67,54,69,45,71,44,76,50,82,60,87,68,91,76,89,73,83,66,78,56,78,74,77]
                    ]
                ]
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    x: 250,
                    y: 200,
                    rotation: 0,
                    ref_points: JSON.parse( JSON.stringify( this.animations.menu[ 0 ] ) ),
                    pos_x: game.cursor.pos_x,
                    pos_y: game.cursor.pos_y,
                    hand: {
                        enable: true,
                        x: 0,
                        y: -18,
                        drag_x: this.animations.hand[ 0 ][ 1 ][ 5 ] - 10,
                        drag_y: this.animations.hand[ 0 ][ 1 ][ 6 ] - 10,
                        pressed: false,
                        line_a: [ 
                            this.animations.hand[ 0 ][ 1 ][ 5 ],
                            this.animations.hand[ 0 ][ 1 ][ 6 ],
                            this.animations.hand[ 0 ][ 2 ][ 5 ],
                            this.animations.hand[ 0 ][ 2 ][ 6 ]
                        ],
                        angle: Math.PI,
                        offset: 0,
                        ref_points: JSON.parse( JSON.stringify( this.animations.hand[ 0 ] ) ),
                        matrix: AnimateMatrix( this.animations.hand[ 0 ], this.animations.hand[ 1 ], 30 )
                    }
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let hand = ltmp.hand;
                
                //Анимируем объект
                UpdateAnimation( this );
                
                //Взаимодействие с рукой
                if( hand.enable === false ) return;
                
                //Клик по руке
                let pos_x = game.cursor.pos_x;
                let pos_y = game.cursor.pos_y;
                let drag_x = ltmp.x + hand.x + hand.drag_x;
                let drag_y = ltmp.y + hand.y + hand.drag_y;
                
                //Проверяем наличие клика на объекте
                let click = ClickDetect( drag_x, drag_y, 20, 20 );
                
                //Захват руки
                if( click && game.cursor.pressed ) {
                    hand.pressed = true;
                } else if( hand.pressed && game.cursor.pressed === false ) {
                    hand.pressed = false;
                }
                
                //Движение мыши
                if( hand.pressed && ( ltmp.pos_x !== pos_x || ltmp.pos_y !== pos_y ) ) {
                    //Сохраняем координаты мыши
                    ltmp.pos_x = pos_x;
                    ltmp.pos_y = pos_y;
                    
                    let angle, offset;
                    
                    //Вычисляем угол относительно тела --------------------------------------------
                    let line_a = [
                        ltmp.x + hand.x + hand.line_a[ 0 ], ltmp.y + hand.y + hand.line_a[ 1 ],
                        ltmp.x + hand.x + hand.line_a[ 2 ], ltmp.y + hand.y + hand.line_a[ 3 ]
                    ];
                    let vector_a = [ line_a[ 2 ] - line_a[ 0 ], line_a[ 3 ] - line_a[ 1 ] ];
                    
                    //Ограничиваем заход руки заспину
                    if( pos_x < line_a[ 2 ] ) pos_x = line_a[ 2 ];
                    
                    let line_b = [ 
                        line_a[ 2 ], line_a[ 3 ],
                        pos_x, pos_y
                    ];
                    let vector_b = [ line_b[ 2 ] - line_b[ 0 ], line_b[ 3 ] - line_b[ 1 ] ];
                    
                    let cross = vector_a[ 0 ] * vector_b[ 1 ] - vector_a[ 1 ] * vector_b[ 0 ];
                    let dot = vector_a[ 0 ] * vector_b[ 0 ] + vector_a[ 1 ] * vector_b[ 1 ];
                    
                    angle = Math.atan2( cross, dot );
                    
                    //Вычисляем расстояние от ладони до плеча -------------------------------------
                    offset =  Math.max( Math.abs( pos_x - line_a[ 2 ] ) , Math.abs( pos_y - line_a[ 3 ] ) );
                    if( offset > 50 ) offset = 50;
                    if( offset < 20 ) offset = 20;
                
                    if( angle !== hand.angle  ||  offset !== hand.offset ) {
                        hand.angle = angle;
                        hand.offset = offset;
                        
                        let ref_source = this.animations.hand[ 0 ];
                        let ref_points = hand.ref_points;
                        let ref_matrix = ltmp.hand.matrix;
                        let frame = 50 - offset;
                        
                        //Меняем угол относительно тела
                        let cos = -Math.cos( angle );
                        let sin = -Math.sin( angle );
                        
                        //Получаем координаты точки заливки (вращать будем вокруг неё)
                        let Fx = ref_source[ 2 ][ 5 ];
                        let Fy = ref_source[ 2 ][ 6 ];
                        
                        for( let i = 1, j, x, y, ref_len = ref_source.length; i < ref_len; i++ ) {
                            for( let j = 5, points_len = ref_source[ i ].length; j < points_len; j += 2 ) {
                                //Получаем опорную точку согласно матрице преобразований
                                x = ref_source[ i ][ j ] + frame * ref_matrix[ i ][ j - 1 ];
                                y = ref_source[ i ][ j + 1 ] + frame * ref_matrix[ i ][ j ];
                                
                                //Вращаем опорную точку относительно точки заливки
                                ref_points[ i ][ j ] = ( cos * ( x - Fx ) ) - ( sin * ( y - Fy ) ) + Fx;
                                ref_points[ i ][ j + 1 ] = ( sin * ( x - Fx ) ) + ( cos * ( y - Fy ) ) + Fy;
                            }
                        }
                        
                        //Возвращаем точку заливки плеча в норму
                        ref_source[ 2 ][ 5 ] = Fx;
                        ref_source[ 2 ][ 6 ] = Fy;
                        
                        //Обновляем координаты захвата
                        hand.drag_x = Math.floor( ref_points[ 1 ][ 5 ] - 10 );
                        hand.drag_y = Math.floor( ref_points[ 1 ][ 6 ] - 10 );
                    }
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let context = game.canvas.context;
                let hand = ltmp.hand;
                
                //Отрисовываем тело на временном холсте
                game.temp_canvas.drawRefPoints( ltmp.ref_points );
                //Копируем временный холст на основной
                context.drawImage( game.temp_canvas.id, ltmp.x, ltmp.y );
                
                
                //Отрисовываем руку на временном холсте
                game.temp_canvas.drawRefPoints( hand.ref_points );
                //Копируем временный холст на основной
                context.drawImage( game.temp_canvas.id, ltmp.x + hand.x, ltmp.y + hand.y );
            }
        },
        
        //-----------------------------------------------------------------------------------------
        //Дождь -----------------------------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        rain: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {
                rain:    { type: 'image', src: '/res/postproc/rain.png' }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    offset: 0,
                    draw_ts: tmp.draw_ts,
                    img_rain: game.scene.objects.rain.resources.rain.data
                };
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {},
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let context = game.canvas.context;
                let img_rain = ltmp.img_rain;
                
                ltmp.offset += Math.floor( ( tmp.draw_ts - ltmp.draw_ts ) / 2 );
                ltmp.draw_ts = tmp.draw_ts;
                if ( ltmp.offset  > 200 ) ltmp.offset  = 0;
                context.drawImage( img_rain, 0, 200 - ltmp.offset, 640, 360, 0, 0, 640, 360 );
            }
        },
    }
};
