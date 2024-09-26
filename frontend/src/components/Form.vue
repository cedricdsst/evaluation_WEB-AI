<template>
  <v-card class="pa-4">
    <v-card-title>
      <v-row class="align-center">
        <v-col cols="12" md="6">
          <span class="text-h5">Ajouter un appartement</span>
        </v-col>
        <v-col cols="12" md="6">
          <div class="purple-rectangle">
            <span>Fontionalités IA : renseigner le prix, la surface et la ville pour obtenir votre note !</span>
          </div>
        </v-col>
      </v-row>
    </v-card-title>
    <v-form ref="form" v-model="isFormValid" @submit.prevent="addSuite">
      <v-row>
       
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="newSuite.nmRooms"
            label="Nombre de chambres"
            type="number"
            required
            outlined
            dense
            :rules="numberRules('chambres', 1, 100)"
          ></v-text-field>
        </v-col>

     
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="newSuite.surface"
            label="Surface (m²)"
            type="number"
            required
            outlined
            dense
            :rules="numberRules('surface', 5, 600)"
          ></v-text-field>
        </v-col>

       
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="newSuite.nbWindows"
            label="Nombre de fenêtres"
            type="number"
            required
            outlined
            dense
            :rules="numberRules('fenêtres', 1, 100)"
          ></v-text-field>
        </v-col>

     
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="newSuite.price"
            label="Prix (€)"
            type="number"
            required
            outlined
            dense
            :rules="numberRules('prix', 50000, 1000000)"
          ></v-text-field>
        </v-col>

     
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="newSuite.annee"
            label="Année de construction"
            type="number"
            required
            outlined
            dense
            :rules="numberRules('année', 2005, 2024)"
          ></v-text-field>
        </v-col>

  
        <v-col cols="12" sm="6">
          <v-switch
            v-model="newSuite.balcon"
            label="Balcon"
            outlined
            dense
          ></v-switch>
        </v-col>

      
        <v-col cols="12" sm="6">
          <v-switch
            v-model="newSuite.garage"
            label="Garage"
            outlined
            dense
          ></v-switch>
        </v-col>

    
        <v-col cols="12" sm="6">
          <v-select
            v-model="newSuite.ville"
            :items="['lyon', 'paris', 'marseille']"
            label="Ville"
            required
            outlined
            dense
          ></v-select>
        </v-col>

        
        <v-col cols="12" sm="6">
          <div class="custom-input-wrapper">
    <v-text-field
      v-model="newSuite.note"
      label="Note prédite"
      readonly
      outlined
      dense
      hide-details

    ></v-text-field>
  </div>
        </v-col>

      
        <v-col cols="12" sm="6">
          <v-select
            v-model="newSuite.price_category"
            :items="['low', 'normal', 'high', 'scam']"
            label="Catégorie de prix"
            required
            outlined
            dense
          ></v-select>
        </v-col>

      </v-row>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          type="submit"
          :disabled="!isFormValid"
        >
          Ajouter
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const emit = defineEmits(['add-suite']);

const form = ref(null);
const isFormValid = ref(false);

const newSuite = ref({
  nmRooms: '',
  surface: '',
  nbWindows: '',
  price: '',
  annee: '',
  balcon: false,
  garage: false,
  note: '',
  price_category: '',
  ville: ''
});


const numberRules = (fieldName, min, max) => [
  v => !!v || `Le champ ${fieldName} est requis`,
  v => (v && v >= min) || `Minimum ${min}`,
  v => (v && v <= max) || `Maximum ${max}`
];


watch(
  () => [newSuite.value.ville, newSuite.value.surface, newSuite.value.price],
  () => {
    predictNote();
  }
);


const predictNote = async () => {
  if (newSuite.value.ville && newSuite.value.surface && newSuite.value.price) {
    try {
      const response = await axios.post('http://localhost:8000/predict/note', {
        ville: newSuite.value.ville,
        surface: parseFloat(newSuite.value.surface),
        price: parseFloat(newSuite.value.price)
      });
      newSuite.value.note = response.data.note.toFixed(2);
    } catch (error) {
      console.error('Erreur lors de la prédiction de la note :', error);
    }
  }
};


const addSuite = async () => {
  if (form.value && form.value.validate()) {
    try {
      const response = await axios.post('http://localhost:4000/apartments', {
        nmRooms: parseInt(newSuite.value.nmRooms),
        surface: parseFloat(newSuite.value.surface),
        nbWindows: parseInt(newSuite.value.nbWindows),
        price: parseFloat(newSuite.value.price),
        annee: parseInt(newSuite.value.annee),
        balcon: newSuite.value.balcon,
        garage: newSuite.value.garage,
        note: parseFloat(newSuite.value.note),
        price_category: newSuite.value.price_category,
        ville: newSuite.value.ville
      });

      if (response.status === 201) {
        emit('add-suite', response.data.apartment);

      
        Object.keys(newSuite.value).forEach(key => {
          newSuite.value[key] = '';
        });

    
        if (form.value) {
          form.value.resetValidation();
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'appartement :', error);
    }
  }
};
</script>

<style scoped>
.purple-rectangle {
  background-color: purple;
  color: white;
  border-radius: 8px;
  padding: 8px;
  font-size: 10px;
}


.custom-input-wrapper {
  background-color: purple;
  padding: 2px;
  border-radius: 4px;
}

</style>
