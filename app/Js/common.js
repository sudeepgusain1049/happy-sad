var isfirst = true;
function openCity($this) {
    $(".tablinks").removeClass("active");
    $($this).addClass("active");
    sessionStorage["Tab"] = $($this).attr("id");
    location.href = $($this).attr("burl");    

    if ($('#menu-content').hasClass('in') === true) {
        $('.toggle-btn').click();
    }
}
console.log($("#menu-content .tablinks"));
$("#menu-content .tablinks").eq(0).addClass("active");
$("#menu-content .tablinks").eq(0).click();

function modifyXaxis(len) {
    if ($(".react-d3-core__axis__xAxis").find("g").length > len || $(window).width() <= 767) {
        $(".react-d3-core__axis__xAxis").find("g").each(function (i, obj) {
            var text = $(obj).find("text");
            text.attr("y", 2);
            text.attr("x", -32.5);
            text.attr("transform", "rotate(-65)")
        });
        $(".react-d3-core__axis__xAxis").parent().children("text").attr("y", "65");
    }
    else {
        $(".react-d3-core__axis__xAxis").find("g").each(function (i, obj) {
            var text = $(obj).find("text");
            text.attr("y", 9);
            text.attr("x", 0.5);
            text.removeAttr("transform");
        });
        $(".react-d3-core__axis__xAxis").parent().children("text").attr("y", "40");
    }
}