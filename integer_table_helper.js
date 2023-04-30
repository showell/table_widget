window.integer_table_helper = (function () {
    const { maybe_stripe, dom_tr, dom_td } = window.dom_helpers;
    const { style_generic_table, style_generic_td, setStyles } =
        window.style_helpers;
    const { simple_table_widget } = window.table_helpers;

    function build_integer_table_widget({ number_store_callback, maxHeight }) {
        function styled_th() {
            const elem = document.createElement("th");
            return setStyles(elem, {
                background: "darkseagreen",
                color: "darkblue",
            });
        }

        function make_th_number() {
            const th = styled_th();
            th.id = "integer-th-number";
            th.append("Number");
            return th;
        }

        function make_th_square() {
            const th = styled_th();
            th.id = "integer-th-square";
            th.innerHTML = "n<sup>2</sup>";
            return th;
        }

        function make_header_row() {
            return dom_tr(th_number, th_square);
        }

        function style_integer_table(table) {
            style_generic_table(table);
            setStyles(table, {
                textAlign: "center",
                width: "365px",
            });
            return table;
        }

        function style_td_n(td) {
            td = style_generic_td(td);
            return setStyles(td, {
                color: "blue",
                width: "230px",
            });
        }

        function style_td_square(td) {
            td = style_generic_td(td);
            return setStyles(td, {
                color: "darkred",
                width: "130px",
                fontSize: "150%",
            });
        }

        function style_tr(tr, i) {
            return maybe_stripe(tr, i, "lightgray");
        }

        function make_td_id(n, field) {
            return `integer-table-${n}-${field}`;
        }

        function square_str(n) {
            return `${n * n}`;
        }

        function make_td_n(n) {
            const id = make_td_id(n, "n");
            const td = dom_td({ id, elem: `${n}` });
            return style_td_n(td);
        }

        function make_td_square(n) {
            const id = make_td_id(n, "square");
            const td = dom_td({ id, elem: square_str(n) });
            return style_td_square(td);
        }

        function make_tr(i) {
            const current_ints = number_store_callback.get_integers();
            const n = current_ints[i];
            const tr = dom_tr(make_td_n(n), make_td_square(n));
            return style_tr(tr, i);
        }

        function get_num_rows() {
            return number_store_callback.size();
        }

        const th_number = make_th_number();
        const th_square = make_th_square();

        const { scroll_container, table, resize_list, repopulate } =
            simple_table_widget({
                make_header_row,
                make_tr,
                get_num_rows,
                maxHeight,
            });

        style_integer_table(table);

        return {
            scroll_container,
            table,
            repopulate,
            resize_list,
            th_number,
            th_square,
        };
    }

    return { build_integer_table_widget };
})();
