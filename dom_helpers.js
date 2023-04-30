window.dom_helpers = (function () {
    function dom_empty_table() {
        const table = document.createElement("table");
        const thead = document.createElement("thead");
        table.append(thead);

        const tbody = document.createElement("tbody");
        table.append(tbody);

        return { table, thead, tbody };
    }

    function dom_tr(...child_elems) {
        const tr = document.createElement("tr");
        tr.append(...child_elems);
        return tr;
    }

    function dom_td({ id, elem }) {
        const td = document.createElement("td");
        td.id = id;
        td.append(elem);
        return td;
    }

    function maybe_stripe(elem, i, color) {
        if (i % 2) {
            setStyles(elem, {
                background: color,
            });
        }

        return elem;
    }

    return {
        dom_empty_table,
        dom_tr,
        dom_td,
        maybe_stripe,
    };
})();
