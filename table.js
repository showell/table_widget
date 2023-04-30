{
    const { setStyles } = window.style_helpers;

    const { wire_up_reverse_button } = window.table_helpers;

    const { build_integer_table_widget } = window.integer_table_helper;

    const { build_single_column_table } = window.single_column_table_helper;

    const { number_store } = window.data_helpers;

    build_person_table();
    build_fruits_table();
    build_prime_table();
    build_even_number_table();

    function build_person_table() {
        const header_title = "Employee";
        const items = ["alice", "bob", "cindy"];
        const table = build_single_column_table({ header_title, items });
        table.id = "persons-table";

        document.querySelector("#persons").append(table);
    }

    function build_fruits_table() {
        const header_title = "Fruit";
        const items = ["apple", "banana", "grape", "pineapple"];
        const table = build_single_column_table({ header_title, items });
        table.id = "persons-table";

        document.querySelector("#fruits").append(table);
    }

    function make_grow_and_shrink_buttons({ even_numbers, resize_list }) {
        /*
            This is to exercise our data-resizing code.
        */
        const container = document.querySelector("#even_numbers");

        function shrink() {
            even_numbers.pop();
            even_numbers.pop();
            even_numbers.pop();
            even_numbers.pop();
            resize_list();
        }

        function grow() {
            even_numbers.push(even_numbers.length * 2);
            even_numbers.push(even_numbers.length * 2);
            even_numbers.push(even_numbers.length * 2);
            even_numbers.push(even_numbers.length * 2);
            resize_list();
        }

        function make_button(label) {
            const button = document.createElement("button");
            button.innerText = label;
            setStyles(button, {
                margin: "5px",
                padding: "7Px",
            });
            return button;
        }

        function make_shrink_button() {
            const button = make_button("shrink (remove 4 rows)");
            container.prepend(button);
            button.addEventListener("click", shrink);
        }

        function make_grow_button() {
            const button = make_button("grow (add 4 rows)");
            container.prepend(button);
            button.addEventListener("click", grow);
        }

        grow();
        make_shrink_button();
        make_grow_button();
    }

    function build_even_number_table() {
        function container() {
            return document.querySelector("#even_numbers");
        }

        let even_numbers = [];

        const number_store_callback = {
            get_integers: () => even_numbers,
            size: () => even_numbers.length,
        };

        const maxHeight = "300px";

        const { table, resize_list, scroll_container, th_number, th_square } =
            build_integer_table_widget({
                number_store_callback,
                maxHeight,
            });

        table.id = "even_numbers";
        setStyles(th_number, {
            color: "darkgreen",
        });

        setStyles(th_square, {
            color: "darkred",
            background: "lightgreen",
        });

        container().append(scroll_container);

        make_grow_and_shrink_buttons({
            even_numbers,
            resize_list,
        });
    }

    function add_reverse_button_to_primes_table({
        reverse_the_numbers,
        repopulate,
        th_number,
    }) {
        function redraw_the_table_with_reversed_numbers() {
            reverse_the_numbers();
            repopulate();
        }

        wire_up_reverse_button({
            th: th_number,
            callback: redraw_the_table_with_reversed_numbers,
        });
    }

    function build_prime_table() {
        function container() {
            return document.querySelector("#prime_squares");
        }

        function prime_number_store() {
            return number_store([2, 3, 5, 7, 11, 13, 17]);
        }

        const { get_integers, size, reverse_the_numbers } = prime_number_store();
        const number_store_callback = { get_integers, size };

        const maxHeight = "200px";

        const { table, th_number, repopulate } = build_integer_table_widget({
            number_store_callback,
            maxHeight,
        });

        table.id = "prime_squares";
        container().append(table);

        add_reverse_button_to_primes_table({
            reverse_the_numbers,
            repopulate,
            th_number,
        });
    }
}
