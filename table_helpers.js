window.table_helpers = (function () {
    const {
        dom_empty_table,
        dom_tr,
        dom_td,
    } = window.dom_helpers;

    function list_renderer({ parent_elem, make_child, get_num_rows }) {
        function overwrite(i, elem) {
            console.log("overwrite", i);
            if (i >= parent_elem.children.length) {
                parent_elem.append(elem);
            } else {
                parent_elem.replaceChild(elem, parent_elem.children[i]);
            }
        }

        function is_child_too_far_down(i) {
            // TODO: integrate once I guarantee tables get wrapped in a scroll
            // container early enough.
            const scroll_container = parent_elem.closest(".table_scroll_container");
            const child_top = parent_elem.children[i].getBoundingClientRect().top;
            const container_bottom =
                scroll_container.getBoundingClientRect().bottom;
            console.log(Math.floor(child_top), Math.floor(container_bottom));

            return child_top > container_bottom;
        }

        function repopulate_range(lo, hi) {
            for (let i = lo; i < hi; ++i) {
                overwrite(i, make_child(i));
            }
        }

        function compress(num_rows) {
            for (let i = parent_elem.children.length - 1; i >= num_rows; --i) {
                parent_elem.children[i].remove();
            }
        }

        function repopulate() {
            const num_rows = get_num_rows();
            compress(num_rows);
            repopulate_range(0, num_rows);
        }

        function resize_list() {
            /*
                The contract here is that none of the existing data elements
                have changed.
            */
            const num_rows = get_num_rows();
            compress(num_rows);
            repopulate_range(parent_elem.children.length, num_rows);
        }

        return { resize_list, repopulate };
    }

    function wrap_table(table, maxHeight) {
        const div = document.createElement("div");

        div.className = "table_scroll_container";

        setStyles(div, {
            display: "inline-block",
            overflowY: "scroll",
            maxHeight,
        });

        div.append(table);
        return div;
    }

    function simple_table_widget({
        make_header_row,
        make_tr,
        get_num_rows,
        maxHeight,
    }) {
        function resize_list() {
            console.log("resize_list", table.id);
            my_renderer.resize_list();
        }

        function repopulate() {
            console.log("repopulate", table.id);
            my_renderer.repopulate();
        }

        const { table, thead, tbody } = dom_empty_table();

        thead.append(make_header_row());

        // It is important to wrap the table with a scrolling container
        // BEFORE you start rendering the list of rows.

        const scroll_container = wrap_table(table, maxHeight);

        const my_renderer = list_renderer({
            parent_elem: tbody,
            make_child: make_tr,
            get_num_rows,
        });

        repopulate();

        return { scroll_container, table, repopulate, resize_list };
    }

    function wire_up_reverse_button({ th, callback }) {
        const button = document.createElement("button");
        button.innerText = "reverse";
        button.addEventListener("click", callback);
        th.append("  ", button);
    }

    return {
        simple_table_widget,
        wire_up_reverse_button,
    };
})();
