// [ Сцена: вспомогательные утилиты ]
scenes.utilities = {
    //Объекты сцены -------------------------------------------------------------------------------
    objects: {
        //-----------------------------------------------------------------------------------------
        //Редактор анимаций персонажей ------------------------------------------------------------
        //
        //Подключение:
        //1) Импортируйте объект на сцену:
        //   scenes.SCENE_NAME.objects.body_editor = scenes.utilities.objects.body_editor;
        //2) Запустите сцену и добавьте на неё персонажа
        //3) Подключитесь к персонажу через вызов select:
        //   game.scene.objects.body_editor.select( game.scene.objects.CHARACTER );
        //
        //Управление:
        // - Tab: переключение редактирования на следующую часть тела
        // - Колесико мыши: выделение следующей/предыдущей опорной точки текущей части тела
        // - Стрелочки (вверх, вниз, влево, вправо): сдвиг выделенной опорной точки на 1px.
        // - Стрелочки + Shift: сдвиг опорных точек всей части тела на 1px.
        //-----------------------------------------------------------------------------------------
        body_editor: {
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    object: null,
                    body: null,
                    sel_part: 0,
                    sel_point: 0,
                    cos: Math.cos( 0.1 ),
                    sin: Math.sin( 0.1 ),
                    control: {
                        wheel: game.cursor.wheel,
                        tab: game.keyboard.tab,
                        up: game.keyboard.up,
                        down: game.keyboard.down,
                        left: game.keyboard.left,
                        right: game.keyboard.right
                    }
                }
            },
            
            //Подключение к телу ------------------------------------------------------------------
            select: function( body ) {
                //Проверяем наличие опорных точек
                if( body.tmp.body === undefined ) {
                    console.log( 'body_editor.select(); -> Ошибка: не найдены опорные точки!');
                    return;
                }
                
                //Добавляем редактор на сцену
                if( this.tmp === undefined ) {
                    game.scene.objects.body_editor.add();
                }
                
                //Подключаемся
                this.tmp.object = body;
                this.tmp.body = body.tmp.body;
            },
            
            //Выводит в консоль готовый слепок опорных точек  -------------------------------------
            print: function() {
                //Добавляем редактор на сцену
                if( this.tmp === undefined ) {
                    console.log( 'body_editor.print(); -> Ошибка: тело персонажа не было подключено!');
                    return;
                }
                
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let body = ltmp.body;
                let i, j;
                let x0, y0;
                let R, G, B, A;
                
                //Создаем пустой массив
                let output = [];
                
                //Копируем в него текущие опорные точки
                for( let i = 0; i < body.length; i++ ) {
                    output[ i ] = [];
                    
                    //Окантовка части тела
                    for( let j = 0; j < body[ i ].length; j++ ) {
                        output[ i ].push( Math.floor( body[ i ][ j ] ) );
                    }
                }
                
                //Форматируем массив в удобный формат строки
                let output_str = JSON.stringify( output );
                output_str = output_str.replace( /\],/g, "],\n" ).replace( /\]\]/, "]\n  ]" ).replace( /\[\[/, "  [\n[" );
                output_str = output_str.replace( /\[/g, "    [" ).replace( /      \[/g, "  [" );
                
                //Выводим новый массив в консоль
                console.log( output_str );
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let body = ltmp.body;
                let control = ltmp.control;
                let direction = 0;
                
                if( body === null ) return;
                
                let max_point = Math.floor( ( body[ ltmp.sel_part ].length - 6 ) / 2 );
                
                //Преключаемся на другую часть тела
                if( control.tab !== game.keyboard.tab ) {
                    let max_parts = body.length - 1;
                    ltmp.sel_point = 0;
                    ltmp.sel_part = ( ltmp.sel_part === max_parts ? 0 : ltmp.sel_part + 1 );
                    control.tab = game.keyboard.tab;
                }
                
                //Преключаемся на другую точку или крутим часть тела
                direction = 0;
                if( control.wheel !== game.cursor.wheel ) {
                    direction = ( control.wheel > game.cursor.wheel ? 1 : 2 );
                    control.wheel = game.cursor.wheel;
                    
                    //Крутим часть тела
                    if( game.keyboard.shift === true ) {
                        for( let i = 1; i < max_point + 1; i++ ) {
                            let Ix = 6 + ( i - 1) * 2;
                            let Iy = Ix + 1;
                            let ox = body[ ltmp.sel_part ][ 0 ];
                            let oy = body[ ltmp.sel_part ][ 1 ];
                            let x = body[ ltmp.sel_part ][ Ix ];
                            let y = body[ ltmp.sel_part ][ Iy ];
                            let cos = ltmp.cos;
                            let sin = ltmp.sin * ( direction === 1 ? 1 : -1 );
                            
                            body[ ltmp.sel_part ][ Ix ] = ( cos * ( x - ox ) ) - ( sin * ( y - oy ) ) + ox;
                            body[ ltmp.sel_part ][ Iy ] = ( sin * ( x - ox ) ) + ( cos * ( y - oy ) ) + oy;
                        }
                    } else {
                        //Сдвигаем выделение опорной точки на соседнюю
                        if( direction === 1 ) {
                            ltmp.sel_point = ( ltmp.sel_point === max_point ? 0 : ltmp.sel_point + 1 );
                        } else {
                            ltmp.sel_point = ( ltmp.sel_point === 0 ? max_point : ltmp.sel_point - 1 );
                        }
                    }
                }
                
                //Редактируем точку
                direction = 0;
                if( control.up !== game.keyboard.up ) {
                    control.up = game.keyboard.up;
                    direction = 1;
                } 
                if( control.down !== game.keyboard.down ) {
                    control.down = game.keyboard.down;
                    direction = 2;
                }
                if( control.left !== game.keyboard.left ) {
                    control.left = game.keyboard.left;
                    direction = 3;
                }
                if( control.right !== game.keyboard.right ) {
                    control.right = game.keyboard.right;
                    direction = 4;
                }
                
                if( direction !== 0 ) {
                    let select = ( game.keyboard.shift === true ? max_point + 1 : 1 );
                    for( let i = 0; i < select; i++ ) {
                        let select_point = ( select === 1 ? ltmp.sel_point : i );
                        let Ix = ( select_point === 0 ? 0 : 6 + ( select_point - 1) * 2 );
                        let Iy = Ix + 1;
                        let x = body[ ltmp.sel_part ][ Ix ];
                        let y = body[ ltmp.sel_part ][ Iy ];
                        
                        switch( direction ) {
                            case 1:
                                if( y > 0 ) body[ ltmp.sel_part ][ Iy ]--;
                            break;
                            
                            case 2:
                                if( y < game.temp_canvas.height - 1 ) body[ ltmp.sel_part ][ Iy ]++;
                            break;
                            
                            case 3:
                                if( x > 0 ) body[ ltmp.sel_part ][ Ix ]--;
                            break;
                            
                            case 4:
                                if( x < game.temp_canvas.width - 1 ) body[ ltmp.sel_part ][ Ix ]++;
                            break;
                        }
                    }
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let context = game.canvas.context;
                let ltmp = this.tmp;
                let body = ltmp.body;
                if( body === null ) return;
                
                let x = ltmp.object.tmp.x;
                let y = ltmp.object.tmp.y;
                
                context.fillStyle = ( ltmp.sel_point === 0 ? 'rgba(60,255,0,255)' : 'rgba(0,190,255,255)' );
                context.fillRect( x + body[ ltmp.sel_part ][ 0 ], y + body[ ltmp.sel_part ][ 1 ], 1, 1 );
                
                for( let i = 6, j = ltmp.sel_part, selected = false; i < body[ j ].length; i += 2 ) {
                    selected = ( ltmp.sel_point === Math.floor( ( i - 4 ) / 2 ) );
                    context.fillStyle = ( selected ? 'rgba(60,255,0,255)' : 'rgba(255,0,0,255)' );
                    context.fillRect( x + body[ j ][ i ], y + body[ j ][ i + 1 ], 1, 1 );
                }
            }
        }
    }
};
