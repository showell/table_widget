window.data_helpers = (function () {

    function number_store(ints) {
        let my_ints = ints.slice();

        function get_integers() {
            return my_ints;
        }

        function size() {
            return my_ints.length;
        }

        function reverse_the_numbers() {
            my_ints.reverse();
        }

        return { get_integers, size, reverse_the_numbers };
    }

    return {
        number_store,
    };
})();
