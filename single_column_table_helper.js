window.single_column_table_helper = (function () {
    const { dom_tr, dom_td } = window.dom_helpers;
    const { simple_table_widget } = window.table_helpers;
    const { style_generic_table } = window.style_helpers;

    function build_single_column_table({ header_title, items }) {
        function make_header_row() {
            const th = document.createElement("th");
            th.innerText = header_title;
            return dom_tr(th);
        }

        function make_tr(i) {
            const id = `item-${i}`;
            const elem = document.createElement("span");
            elem.innerText = items[i];
            return dom_tr(dom_td({ id, elem }));
        }

        function get_num_rows() {
            return items.length;
        }

        const maxHeight = "150px";

        const { table } = simple_table_widget({
            make_header_row,
            make_tr,
            get_num_rows,
            maxHeight,
        });

        style_generic_table(table);

        return table;
    }

    return { build_single_column_table };
})();
