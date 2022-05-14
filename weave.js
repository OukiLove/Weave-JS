cheat.log("Hello user!");
cheat.print_to_console("Script load, hello User!", [1, 1, 255]);

var screen_size = render.get_screen_size(); // [1680, 1050]

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

ui.add_checkbox('Rainbow line', 'rainbow_line')
ui.add_slider('Rainbow line speed', 'rainbow_line_speed', 1, 10)

register_callback('render', function(){
    var realtime = global_vars.realtime();
    var rls = vars.get_int("js.rainbow_line_speed");
    var hsv = HSVtoRGB(realtime * rls / 10 % 360, 1, 1);
    if(vars.get_bool("js.rainbow_line"))
    {
        render.filled_rect([0, 0], [screen_size[0], 5], [hsv.r, hsv.g, hsv.b, 255], 0);
    }
})

ui.add_checkbox('Custom keybind list', 'custom_keybind_list')
ui.add_slider('Keybind poss X', 'keybind_poss_x', 0, screen_size[0])
ui.add_slider('Keybind poss Y', 'keybind_poss_y', 0, screen_size[1])

function keybinds() {
    var keybinds_list = [
        ["doubletap", "Double Tap"],
        ["override_damage", "Minimum Damage"],
        ["hide_shots", "Hide Shots"],
        ["force_safepoints", "Safe Points"],
        ["body_aim", "Body Aim"],
        ["inverter", "Inverter"],
        ["fake_duck", "Fake Duck"],
        ["slow_walk", "Slow Motion"],
        ["peek_assist", "Auto Peek"]
    ]
    var active_keybinds_list = [];
    var x = vars.get_int("js.keybind_poss_x");
    var y = vars.get_int("js.keybind_poss_y");
    if (vars.get_bool('js.custom_keybind_list'))
    {
        for (var i in keybinds_list) {
            if (vars.is_bind_active(keybinds_list[i][0])) active_keybinds_list.push(i);
        }
        render.filled_rect([x - 5, y - 30], [150, 31], [0, 0, 0, 255], 5);
        render.text([x + 40, y - 15], [255, 255, 255, 255], 12, 5, "KeyBinds");
        render.rect([x - 5, y], [150, 1], [255, 255, 255, 230], 0);
        for (var i in active_keybinds_list) {
            render.text([x, y + 15 + 15 * i - 4], [255, 255, 255, 255], 12, 5, keybinds_list[active_keybinds_list[i]][1]);
            render.text([x + 115, y + 15 + 15 * i - 4], [255, 255, 255, 255], 12, 5, "[on]");
        }
    }
}
register_callback('render', keybinds);