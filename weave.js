cheat.log("Hello user!");
cheat.print_to_console("Script load, hello User!", [1, 1, 255]);
utils.play_sound("C:\\Ouki76\\start.wav")

var screen_size = render.get_screen_size(); // [1680, 1050]
var localPlayer = entity.get_local_player();

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

function custom_keybind_list() {
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
register_callback('render', custom_keybind_list);

ui.add_checkbox('Custom hitsound', 'custom_hitsound')

function custom_hitsound()
{
    var userid = entity.get_player_for_user_id(current_event.get_int("userid"))
    var attacker = entity.get_player_for_user_id(current_event.get_int("attacker"))

    if (attacker == entity.get_local_player() && userid != entity.get_local_player() && vars.get_bool('js.custom_hitsound'))
        utils.play_sound("C:\\Ouki76\\hit.wav");
}

register_callback('player_hurt', custom_hitsound)

ui.add_checkbox('Background', 'black_background')

function black_background()
{
    points = [];
    var alpha = ui.get_menu_alpha()

    if (!alpha) return;

    if (vars.get_bool('js.black_background'))
    {
        render.filled_rect([0, 0], screen_size, [0, 0, 0, 80 * alpha], 0);
    }
}

register_callback('render', black_background)

ui.add_checkbox('Damage marker', 'damage_marker')

function lerp(a, b, c) 
{
    return a+(b-a)*c;
 };

const damagemarker = {
	hits: [],
	event: function() {
		var attacker = entity.get_player_for_user_id(current_event.get_int('attacker'));
		var attacked = entity.get_player_for_user_id(current_event.get_int('userid'));
	    var damage = current_event.get_int('dmg_health');
	    var hitgroup = current_event.get_int('hitgroup');
	    var color = [255, 255, 255, 255];
	    if(hitgroup == 1) color = [0, 0, 255, 255];
	    if (attacker == entity.get_local_player() && attacker != attacked) {
	    	var pos = entity.get_origin(attacked)
	    	pos[2] += 64
	    	pos[1] += math.random_int(-10, 10);
	    	pos[0] += math.random_int(-10, 10);
		    damagemarker.hits.push({
			    	ent: attacked,
			    	position: pos,
			    	alpha: 25550,
			    	damage: damage,
			    	color: color,
			    	offset: 0
			    });
	    }
	},
	run: function() {
		if (!vars.get_bool("js.damage_marker"))
			return;

		for (var i = 0; i < damagemarker.hits.length; i++) {
			damagemarker.hits[i].alpha = lerp(damagemarker.hits[i].alpha,0,4*global_vars.frametime())
			damagemarker.hits[i].color[3] = Math.min(255,damagemarker.hits[i].alpha)
			damagemarker.hits[i].offset += 50*global_vars.frametime()
			var position = render.world_to_screen(damagemarker.hits[i].position)
			if (damagemarker.hits[i].alpha > 0) {
				render.text(
					[ position[0], position[1]-damagemarker.hits[i].offset, ],
					damagemarker.hits[i].color, 12, 0, "" + damagemarker.hits[i].damage)
			} else damagemarker.hits.shift();
		}
	},
};

register_callback('render', function(){
    damagemarker.run();
});

register_callback("player_hurt", function() {
	damagemarker.event();
});

function Bye()
{
    utils.play_sound('C:\\Ouki76\\bye.wav')
    cheat.log('Goodbye User!')
}

register_callback('unload', Bye)