<template>
  <v-container>
    <Form @add-suite="handleAddSuite" class="mt-6" />
    <h3 class="text-h4 mb-6 text-center">Liste d'appartements</h3>
    <v-row>
      <v-col v-for="suite in paginatedSuites" :key="suite.id" cols="12" sm="6" md="4">
        <v-card class="mx-auto" max-width="400" elevation="3">
          <v-card-title class="text-h6 font-weight-bold">
            Appartement #{{ suite.id }}
          </v-card-title>
          <v-card-text>
            <v-list-item prepend-icon="mdi-bed">
              <v-list-item-title>{{ suite.nmRooms }} chambres</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-ruler-square">
              <v-list-item-title>{{ suite.surface }} m²</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-window-maximize">
              <v-list-item-title>{{ suite.nbWindows }} fenêtres</v-list-item-title>
            </v-list-item>
            <v-list-item prepend-icon="mdi-currency-eur">
              <v-list-item-title>{{ suite.price.toLocaleString() }} €</v-list-item-title>
            </v-list-item>
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="removeSuite(suite.id)" icon="mdi-delete" variant="text"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    
    <v-pagination
      v-model="currentPage"
      :length="pageCount"
      :total-visible="7"
      class="mt-6"
    ></v-pagination>
  </v-container>
</template>


<script setup>

import { ref, computed, onMounted } from 'vue';
import Form from './Form.vue';
import axios from 'axios';

const suites = ref([]);

const currentPage = ref(1);
const itemsPerPage = 6;

const pageCount = computed(() => Math.ceil(suites.value.length / itemsPerPage));

const paginatedSuites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return suites.value.slice(start, end);
});

const handleAddSuite = (newSuite) => {
  suites.value.push({
    ...newSuite,
    id: parseInt(newSuite.id),
    nmRooms: parseInt(newSuite.nmRooms),
    surface: parseFloat(newSuite.surface),
    nbWindows: parseInt(newSuite.nbWindows),
    price: parseFloat(newSuite.price)
  });
};

const removeSuite = async (id) => {
  try {
    const response = await axios.delete(`http://localhost:4000/apartments/${id}`);
    if (response.status === 200) {
      suites.value = suites.value.filter(suite => suite.id !== id);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'appartement :', error);
   
  }
};

const fetchApartments = async () => {
  try {
    const response = await axios.get('http://localhost:4000/apartments');
    if (response.status === 200) {
      suites.value = response.data.map(apartment => ({
        id: parseInt(apartment.id),
        nmRooms: parseInt(apartment.nmRooms),
        surface: parseFloat(apartment.surface),
        nbWindows: parseInt(apartment.nbWindows),
        price: parseFloat(apartment.price)
      }));
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des appartements :', error);

  }
};

onMounted(() => {
  fetchApartments();
});


</script>