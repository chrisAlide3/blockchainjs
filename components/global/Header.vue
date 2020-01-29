<template>
  <nav>
    <!-- Left Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
    >
      <v-toolbar flat dark class="orange">
        <v-list>
          <v-list-tile>
            <v-avatar
              :tile="tile"
              :size="avatarSize"
              color="grey lighten-4"
            >
              <img :src="require('../../assets/images/bitcoinLogo.png')" >
            </v-avatar>
            <v-list-tile-title class="title ml-4">
              Pseudo-Coin
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider />

      <v-list dense class="pt-0">
        <div v-for="item in items" :key="item.title">
          <!-- Items without Submenus -->
          <v-list-tile v-if="item.subItems.length === 0"
            :key="item.title"
            router
            :to="item.route"
            exact
          >
            <v-list-tile-action>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <!-- Item with Subitems -->
          <v-list-group v-if="item.subItems.length > 0" no-action>
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>
                    {{ item.icon }}
                  </v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
            <!-- Subitems -->
            <template v-for="subItem in item.subItems">
              <v-list-tile
                :key="subItem.title"
                router
                :to="subItem.route"
                exact
              >
                <v-list-tile-action>
                  <v-icon>{{ subItem.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list-group>
        </div>
      </v-list>
    </v-navigation-drawer>

    <!-- Application Toolbar -->
    <v-toolbar fixed app dark color="orange">
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>
      
      <v-avatar
        :tile="tile"
        :size="avatarSize"
        color="grey lighten-4"
      >
        <img :src="require('../../assets/images/bitcoinLogo.png')" >
      </v-avatar>

      <v-toolbar-title @click="$router.push('/')" :style="{cursor: 'pointer'}" class="white--text">Pseudo-Coin</v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-for="item in items" :key="item.title">
        <!-- Buttons for Items without subItems -->
        <div v-if="item.subItems.length === 0">
          <v-btn flat @click="$router.push(item.route)">
            <v-icon class="mr-2">{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>  
        </div>
        <!-- Menu Dropdown for items with Subitems -->
        <div v-else>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                flat
                dark
                v-on="on"
              >
              <v-icon class="mr-2">{{ item.icon }}</v-icon>
                {{ item.title }}
              <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-tile
                v-for="subItem in item.subItems"
                :key="subItem.title"
                @click="$router.push(subItem.route)"
              >
                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </div>
      </div>      
    </v-toolbar>
  </nav>
</template>

<script>
  export default {
    data () {
      return {
        drawer: false,
        items: [
          { title: 'Register', icon: 'dashboard', route: '/register', subItems: []},
          { title: 'Wallets', icon: 'dashboard', route: '/wallet', subItems: []},
          { title: 'Blockchain', icon: 'question_answer', route: '', subItems: [
            { title: 'Blockchain', icon: 'dashboard', route: '/blockchain'},
            { title: 'Cockpit', icon: 'dashboard', route: '/cockpit'},
            { title: 'Mine Block', icon: 'dashboard', route: '/mine'}
          ]
          },
          { title: 'Transactions', icon: 'dashboard', route: '/transactions', subItems: []},
        ],
      }
    }
  }
</script>