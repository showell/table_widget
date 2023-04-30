/*
This is a raw document that I used to create a video describing
one of my favorite design patterns in JS.  Hopefully I will
remember to come back here and add the YouTube link.

DO NOT USE INHERITANCE for this kind of problem!!!!

Use function composition:

list_renderer
    simple_table_widget
        easy_table
        build_integer_table_widget
            build_even_number_table
            build_prime_table

*/

function list_renderer({ parent_elem, make_child, get_num_rows }) {
    return { resize_list, repopulate };
}

    function simple_table_widget({
        make_header_row,
        make_tr,
        get_num_rows,
        maxHeight,
    }) {
        const my_renderer = list_renderer({
            parent_elem: tbody,
            make_child: make_tr,
            get_num_rows,
        });

        function resize_list() {
            console.log("resize_list", table.id);
            my_renderer.resize_list();
        }

        function repopulate() {
            console.log("repopulate", table.id);
            my_renderer.repopulate();
        }


        return { scroll_container, table, repopulate, resize_list };
    }

        function easy_table({ header_title, items }) {
            const {table} = simple_table_widget({
                make_header_row,
                make_tr,
                get_num_rows,
                maxHeight,
            });

            return table;
        }

        function build_integer_table_widget({ number_store_callback, maxHeight }) {
            const { scroll_container, table, resize_list, repopulate } =
                simple_table_widget({
                    make_header_row,
                    make_tr,
                    get_num_rows,
                    maxHeight,
                });

            return {
                scroll_container,
                table,
                repopulate,
                resize_list,
                th_number,
                th_square,
            };
        }

            function build_even_number_table() {
                const {table, resize_list, scroll_container, th_number, th_square} = build_integer_table_widget({
                    number_store_callback,
                    maxHeight,
                });
            }

            function build_prime_table() {
                const {table, th_number, repopulate} = build_integer_table_widget({
                    number_store_callback,
                    maxHeight,
                });
            }

