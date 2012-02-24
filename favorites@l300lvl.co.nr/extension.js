/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

/* Copyright (c) Chris Vine, 2011
 * Copyright (c) l300lvl, 2012
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Shell = imports.gi.Shell;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Gettext = imports.gettext;

const FAVORITE_APPS_KEY = "favorite-apps";
/* EDIT ONLY THE FOLLOWING LINE */
const FOR_PANEL = "icon";  //CHANGES THE PANEL APPEARANCE. OPTIONS ARE TEXT/ICON/BOTH IN LOWERCASE. BOTH SHOWS THE TEXT TO THE RIGHT OF THE ICON.
/* STOP EDITING HERE. DO NOT EDIT BELOW THIS LINE */

function add_item(button, app) {
    let item = new PopupMenu.PopupBaseMenuItem;
    button.menu.addMenuItem(item);

    let box = new St.BoxLayout({vertical: false,
				pack_start: false,
				style_class: "favorite-menu-box"});
    item.addActor(box);
    let icon = app.create_icon_texture(24);
    box.add(icon);
    let label = new St.Label({text: app.get_name()});
    box.add(label);

    item.connect("activate", function () {app.open_new_window(-1);});
}

function build_menu(button) {
    let settings = new Gio.Settings({schema: "org.gnome.shell"});
    let items = settings.get_strv(FAVORITE_APPS_KEY);

    items.forEach(function (s) {
	let app = Shell.AppSystem.get_default().lookup_app(s);
        if (app) add_item(button, app);
    });
};

var button = null;
var id = null;

function enable() {

    let user_locale_path = global.userdatadir + "/extensions/favorites@l300lvl.co.nr/locale";
    Gettext.bindtextdomain("favorites", user_locale_path);
    Gettext.textdomain("favorites");

    button = new PanelMenu.Button(0.0);
    build_menu(button);

                    if (favoritesicon == "text") {
    let label = new St.Label({text: Gettext.gettext("Favorites")});
    button.actor.add_actor(label);
                    } else if (favoritesicon == "icon") {
    let label = new St.Icon({ icon_name: 'emblem-favorite',
                                 icon_type: St.IconType.SYMBOLIC,
                                 style_class: 'system-status-icon',
//                                 icon_size: this.ICON_SIZE
                                 tooltip_text: Gettext.gettext("Favorites")
                               });
    button.actor.add_actor(label);
                    } else if (favoritesicon == "both") {
    this._boxIconText = new St.BoxLayout({ vertical: false });
    this._boxIconText.add_actor( new St.Icon({ icon_name: 'emblem-favorite',
                                 icon_type: St.IconType.SYMBOLIC,
                                 style_class: 'system-status-icon'
                               }));
    this._boxIconText.add_actor(new St.Label( {text: Gettext.gettext(" Favorites") }));

    button.actor.add_actor(this._boxIconText);
                    }

    Main.panel._leftBox.insert_actor(button.actor, 2);
    Main.panel._leftBox.child_set(button.actor, { y_fill : true } );
    Main.panel._menus.addMenu(button.menu);

    id = global.settings.connect("changed::" + FAVORITE_APPS_KEY,
				 function() {
				     button.menu.removeAll();
				     build_menu(button);
				 });
}

function disable() {
    if (id) global.settings.disconnect(id);
    if (button) button.destroy();
    button = null;
    id = null;
}

function init() {
    favoritesicon = FOR_PANEL;
}
