// [ Вспомогательные утилиты ]
var utilities = {
    //-----------------------------------------------------------------------------------------
    //Редактор опорных точек объекта ----------------------------------------------------------
    //
    //Использование:
    //1) Запустите сцену и добавьте на неё редактируемый объект:
    //   game.scene.objects.OBJECT.add();
    //2) Подключитесь к объекту через вызов add( object ):
    //   utilities.points_editor.add( game.scene.objects.OBJECT );
    //3) Для отключения вызовите del():
    //   utilities.points_editor.del();
    //
    //Управление:
    // - [ Page Up / Page Down ]: переключение редактирования на следующий/предыдущий слой.
    // - Shift + [ Page Up / Page Down ]: поднять/опустить порядок отрисовки слоя.
    // - Колесико мыши: переключение выделения на следующую/предыдущую опорную точку текущего слоя.
    // - Shift + Колесико мыши: вращение текущего слоя вокруг точки заливки.
    // - [ Вверх / Вниз / Вправо / Влево ]: сдвиг выделенной опорной точки на 1px.
    // - Shift + [ Вверх / Вниз / Вправо / Влево ]: сдвиг всех опорных точек слоя на 1px.
    // - [ Плюс / Минус ]: добавить/удалить опорную точку.
    // - Shift + [ Плюс / Минус ]: добавить/удалить слой (добавляется над текущим).
    // - Delete: включить/отключить очистку первого ребра от контура.
    //-----------------------------------------------------------------------------------------
    points_editor: {
        //Инициализация объекта ---------------------------------------------------------------
        init: function() {
            //Создаем временные переменные
            this.tmp = {
                object: null,
                ref_points: null,
                sel_layer: 1,
                sel_point: 0,
                cos: Math.cos( 0.1 ),
                sin: Math.sin( 0.1 ),
                control: {
                    wheel:      game.cursor.wheel,
                    tab:        game.keyboard.tab,
                    up:         game.keyboard.up,
                    down:       game.keyboard.down,
                    left:       game.keyboard.left,
                    page_up:    game.keyboard.page_up,
                    page_down:  game.keyboard.page_down,
                    minus:      game.keyboard.minus,
                    plus:       game.keyboard.plus,
                    del:        game.keyboard.del
                }
            }
        },
        
        //Подключение к редактируемому объекту ------------------------------------------------
        add: function( object ) {
            //Проверяем наличие опорных точек
            if( object.tmp.ref_points === undefined ) {
                console.log( 'utilities.points_editor.add( object ); -> Ошибка: не найдены опорные точки!' );
                return;
            }
            
            if( config.debug ) console.log( 'utilities.points_editor.add( object );' );
            
            //На случай импорта из другой сцены
            if( game.scene.objects.points_editor === undefined ) {
                game.scene.objects.points_editor = this;
            }
            
            //Инициализируем объект
            this.init();
            
            //Включаем отрисовку объекта
            game.scene.layers.push( 'points_editor' );
            
            //Подключаемся
            this.tmp.object = object;
            this.tmp.ref_points = object.tmp.ref_points;
        },
        
        //Отключение от к редактируемого объекта ----------------------------------------------
        del: function() {
            let obj_pos = game.scene.layers.indexOf( 'points_editor' );
            if( obj_pos > -1 ) {
                if( config.debug ) console.log( 'utilities.points_editor.del();' );
                
                //Удаляем из списка на отрисовку
                game.scene.layers.splice( obj_pos, 1 );
                
                //Удаляем временные переменные
                this.tmp.object = null;
                this.tmp.ref_points = null;
                delete this.tmp;
            }
        },
        
        //Вывод в консоль готового слепка опорных точек  --------------------------------------
        print: function() {
            //Добавляем редактор на сцену
            if( this.tmp === undefined ) {
                console.log( 'utilities.points_editor.print(); -> Ошибка: объект для редактирования не был подключен!');
                return;
            }
            
            //Получаем короткие ссылки
            let ref_points = this.tmp.ref_points;
            
            //Создаем пустой массив
            let output = [];
            
            //Копируем в него текущие опорные точки
            for( let i = 0; i < ref_points.length; i++ ) {
                output[ i ] = [];
                
                for( let j = 0; j < ref_points[ i ].length; j++ ) {
                    output[ i ].push( Math.floor( ref_points[ i ][ j ] ) );
                }
            }
            
            //Формируем из массива строку в удобном формате
            let output_str = JSON.stringify( output );
            output_str = output_str.replace( /\],/g, "],\n" ).replace( /\]\]/, "]\n  ]" ).replace( /\[\[/, "  [\n[" );
            output_str = output_str.replace( /\[/g, "    [" ).replace( /      \[/g, "  [" );
            
            //Выводим строку в консоль
            console.log( output_str );
        },
        
        //Обновление объекта ------------------------------------------------------------------
        update: function() {
            //Получаем короткие ссылки
            let ltmp = this.tmp;
            let ref_points = ltmp.ref_points;
            let control = ltmp.control;
            let direction = 0;
            let Ix, Iy, x, y, i, j;
            
            if( ref_points === null ) return;
            
            //Преключаемся на другой слой или меняем порядок слоёв
            if( control.page_up !== game.keyboard.page_up  ||  control.page_down !== game.keyboard.page_down ) {
                //Определяем направление переключения
                direction = ( control.page_up !== game.keyboard.page_up ? 0 : 1 );
                control.page_up = game.keyboard.page_up;
                control.page_down = game.keyboard.page_down;
                
                let layers_len = ref_points.length - 1;
                
                //Поднимаем/опускаем порядок отрисовки слоя
                if( game.keyboard.shift === true ) {
                    let tmp_layer;
                    //Поднимаем слой
                    if( direction === 0 ) {
                        if( ltmp.sel_layer !== layers_len ) {
                            tmp_layer = ref_points[ ltmp.sel_layer + 1 ];
                            ref_points[ ltmp.sel_layer + 1 ] = ref_points[ ltmp.sel_layer ];
                            ref_points[ ltmp.sel_layer ] = tmp_layer;
                            ltmp.sel_layer++;
                        }
                    } else if( ltmp.sel_layer !== 1 ) {
                        //Опускаем слой
                        tmp_layer = ref_points[ ltmp.sel_layer - 1 ];
                        ref_points[ ltmp.sel_layer - 1 ] = ref_points[ ltmp.sel_layer ];
                        ref_points[ ltmp.sel_layer ] = tmp_layer;
                        ltmp.sel_layer--;
                    }
                } else {
                    //Переключаем активный слой на соседний
                    if( direction === 0 ) {
                        ltmp.sel_layer = ( ltmp.sel_layer === layers_len ? 1 : ltmp.sel_layer + 1 );
                    } else {
                        ltmp.sel_layer = ( ltmp.sel_layer === 1 ? layers_len : ltmp.sel_layer - 1 );
                    }
                    ltmp.sel_point = 0;
                }
            }
            
            //Определяем количество опорных точек активного слоя (без точки заливки)
            let points_len = Math.floor( ( ref_points[ ltmp.sel_layer ].length - 7 ) / 2 );
            
            //Добавление/удаление опорных точек или слоя
            if( control.minus !== game.keyboard.minus  ||  control.plus !== game.keyboard.plus ) {
                //Определяем тип действия
                direction = ( control.minus !== game.keyboard.minus ? 0 : 1 );
                control.minus = game.keyboard.minus;
                control.plus = game.keyboard.plus;
                
                //Добавляем/удаляем  слой
                if( game.keyboard.shift === true ) {
                    //Удаляем
                    if( direction === 0 ) {
                        let layers_len = ref_points.length - 1;
                        
                        //Минимум 1 слой должен оставаться
                        if( layers_len > 1 ) {
                            ref_points.splice( ltmp.sel_layer, 1 );
                            layers_len--;
                            ltmp.sel_layer = ( ltmp.sel_layer === 1 ? layers_len : ltmp.sel_layer - 1 )
                        }
                    } else {
                        //Добавляем
                        ref_points.splice( ltmp.sel_layer + 1, 0, [0,0,0,255,0,75,75,75,71,68,78,82,78] );
                        ltmp.sel_layer++;
                    }
                    
                } else if( ltmp.sel_point !== 0 ) {
                    //Добавляем/удаляем опорную точку
                    Ix = 7 + ( ltmp.sel_point - 1) * 2;
                    Iy = Ix + 1;
                    
                    //Удаляем
                    if( direction === 0 ) {
                        //Минимум 3 точки должны оставаться в слое
                        if( points_len > 3 ) {
                            ref_points[ ltmp.sel_layer ].splice( Ix, 2 );
                            if( ltmp.sel_point === points_len ) ltmp.sel_point--;
                            points_len--;
                        }
                    } else {
                        //Добавляем
                        x = ref_points[ ltmp.sel_layer ][ Ix ] + 5;
                        y = ref_points[ ltmp.sel_layer ][ Iy ] + 5;
                        ref_points[ ltmp.sel_layer ].splice( Ix, 0, y );
                        ref_points[ ltmp.sel_layer ].splice( Ix, 0, x );
                        points_len++;
                    }
                }
            }
            
            //Преключаем выделение на другую точку или крутим весь слой
            if( control.wheel !== game.cursor.wheel ) {
                direction = ( control.wheel > game.cursor.wheel ? 0 : 1 );
                control.wheel = game.cursor.wheel;
                
                //Крутим слой вокруг точки заливки слоя
                if( game.keyboard.shift === true ) {
                    //Получаем координаты точки заливки (вращать будем вокруг неё)
                    let Fx = ref_points[ ltmp.sel_layer ][ 5 ];
                    let Fy = ref_points[ ltmp.sel_layer ][ 6 ];
                    
                    //Вращаем опорные точки
                    for( i = 0; i < points_len; i++ ) {
                        //Получаем опорную точку
                        Ix = 7 + i * 2;
                        Iy = Ix + 1;
                        x = ref_points[ ltmp.sel_layer ][ Ix ];
                        y = ref_points[ ltmp.sel_layer ][ Iy ];
                        
                        //Определяем направление вращения
                        let sin = ( direction === 0 ? ltmp.sin : -ltmp.sin );
                        
                        //Преобразуем координаты
                        ref_points[ ltmp.sel_layer ][ Ix ] = ( ltmp.cos * ( x - Fx ) ) - ( sin * ( y - Fy ) ) + Fx;
                        ref_points[ ltmp.sel_layer ][ Iy ] = ( sin * ( x - Fx ) ) + ( ltmp.cos * ( y - Fy ) ) + Fy;
                    }
                } else {
                    //Переключаем выделение опорной точки на соседнюю
                    if( direction === 0 ) {
                        ltmp.sel_point = ( ltmp.sel_point === points_len ? 0 : ltmp.sel_point + 1 );
                    } else {
                        ltmp.sel_point = ( ltmp.sel_point === 0 ? points_len : ltmp.sel_point - 1 );
                    }
                }
            }
            
            //Сдвигаем опорную точку/точки
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
                let select_points = ( game.keyboard.shift === true ? points_len + 1 : 1 );
                for( i = 0; i < select_points; i++ ) {
                    //Определяем индекс выделенной точки
                    j = ( select_points === 1 ? ltmp.sel_point : i );
                    
                    //Получаем опорную точку
                    Ix = 5 + j * 2;
                    Iy = Ix + 1;
                    x = ref_points[ ltmp.sel_layer ][ Ix ];
                    y = ref_points[ ltmp.sel_layer ][ Iy ];
                    
                    //Сдвигаем
                    switch( direction ) {
                        case 1:
                            if( y > 0 ) ref_points[ ltmp.sel_layer ][ Iy ]--;
                        break;
                        
                        case 2:
                            if( y < game.temp_canvas.height - 1 ) ref_points[ ltmp.sel_layer ][ Iy ]++;
                        break;
                        
                        case 3:
                            if( x > 0 ) ref_points[ ltmp.sel_layer ][ Ix ]--;
                        break;
                        
                        case 4:
                            if( x < game.temp_canvas.width - 1 ) ref_points[ ltmp.sel_layer ][ Ix ]++;
                        break;
                    }
                }
            }
            
            //Включаем/выключаем очистку от окантовки между первой и второй точкой
            if( control.del !== game.keyboard.del ) {
                control.del = game.keyboard.del;
                ref_points[ ltmp.sel_layer ][ 0 ] = ( ref_points[ ltmp.sel_layer ][ 0 ] === 1 ? 0 : 1 );
            }
        },
        
        //Отрисовка объекта -------------------------------------------------------------------
        draw: function() {
            //Получаем короткие ссылки
            let context = game.canvas.context;
            let ltmp = this.tmp;
            let ref_points = ltmp.ref_points;
            if( ref_points === null ) return;
            
            let x = ltmp.object.tmp.x;
            let y = ltmp.object.tmp.y;
            let layer = ltmp.sel_layer;
            let layers_len = ref_points[ layer ].length;
            
            //Рисуем опорные точки
            for( let i = 5, selected = false, fill = false; i < layers_len; i += 2 ) {
                selected = ( ltmp.sel_point === Math.floor( ( i - 5 ) / 2 ) );
                fill = ( i > 6 ? false :  true );
                
                context.fillStyle = ( selected ? 'rgb(60,255,0)' : ( fill ? 'rgb(0,190,255)' : 'rgb(255,0,0)' ) );
                context.fillRect( x + Math.floor( ref_points[ layer ][ i ] ), y + Math.floor( ref_points[ layer ][ i + 1 ] ), 1, 1 );
            }
            
            //Обводим контуром рабочую область
            context.fillStyle = 'rgb(255,255,255)';
            context.fillRect( x - 1, y - 1, game.temp_canvas.width + 1, 1 );
            context.fillRect( x - 1, y - 1, 1, game.temp_canvas.height + 1 );
            context.fillRect( x + game.temp_canvas.width, y - 1, 1, game.temp_canvas.height + 1 );
            context.fillRect( x - 1, y + game.temp_canvas.height, game.temp_canvas.width + 2, 1 );
            
            //Выводим информацию
            context.fillStyle = 'rgb(255,255,255)';
            context.fillRect( x - 1, y - 12, 50, 12 );
            context.fillStyle = 'rgb(0,0,0)';
            context.font = 'normal 7pt Arial';
            context.fillText( 'Слой: ' + ltmp.sel_layer, x + 1, y - 3 );
        }
    }
};
