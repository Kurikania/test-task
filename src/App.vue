<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-toolbar-title>Oyster app</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-card>
        <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
        </v-card-title>
      <v-data-table
        :search="search"
        :headers="headers"
        :items="data"
        :sort-desc="[false, true]"
        multi-sort
        class="elevation-1"
        :footer-props="footerProps"
        @update:items-per-page="getItemPerPage"
      >
        <template #item.name_address="{ item }">
          <span v-html="item.name_address"></span>
        </template>
      </v-data-table>
      </v-card>
          <v-snackbar
            v-model="snackbar"            
          >
            {{ text }}
            <template v-slot:action="{ attrs }">
              <v-btn
                color="red"
                text
                v-bind="attrs"
                @click="reload"
              >
                Reload
              </v-btn>
            </template>
          </v-snackbar>
    </v-main>
  </v-app>
</template>
<script>
import reqwest from "reqwest";

export default {
  data() {
    return {
      text: `Error on the server. Reload the page`,
      snackbar: false,
      search: "",
      data: [],
      footerProps: { "items-per-page-options": [5, 12, 25, 36] },
      loading: false,
      headers: [
        { text: "Name/address", align: "start", value: "name_address" },
        {
          text: "Mail",
          sortable: false,
          value: "contacts[0].emails[0]",
        },
        {
          text: "phone",
          sortable: false,
          value: "contacts[0].phones[0]",
        },
        {
          text: "Creation date",
          sortable: false,
          value: "created_at",
        },
      ],
    };
  },
  mounted() {
    this.fetch();
  },

  methods: {
    getItemPerPage(val) {
      console.log(val);
    },
    reload() {
      window.location.reload()
    },
    fetch(params = {}) {
      console.log("params:", params);
      this.loading = true;
      reqwest({
        url: "http://localhost:4000/",
        method: "get",
        data: {
          results: 10,
          ...params,
        },
        type: "json",
      }).then((data) => {
        console.log(data.status) 
        if (data.status == 500) {
          this.snackbar = true
        } else {
          const monthNames = [ "Jan", "Feb", "Mar",  "Apr", "May",  "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ]; 
        this.data = data.data;
        this.data.forEach(function (a) {
          let date = new Date(a.createdAt);
          a.name_address = `${a.name} <br />
            ${a.addresses[0].streetName}  ${a.addresses[0].streetNumber}`;
          a.created_at =
            date.getDay() + " " + monthNames[date.getMonth()] + " " +
            date.getFullYear() + " " + date.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}); 
        });
          }
      });
    },
  },
};
</script>

<style scoped>
</style>