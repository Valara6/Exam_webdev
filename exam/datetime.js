$(function () {
    $('#datetimepicker').datetimepicker({
        format: 'HH:mm',
        disabledTimeIntervals: [[moment({ h: 0 }), moment({ h: 6 })], [moment({ h: 17, m: 30 }), moment({ h: 24 })]],
        enabledHours: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
        stepping: 15
    });
});