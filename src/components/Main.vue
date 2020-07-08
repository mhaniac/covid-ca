<template>
    <div>
      <div v-if="cargando" class="text-center">
        <pulse-loader :loading="cargando"></pulse-loader>
      <small full-width >Cargando datos...</small>
      </div>
      
      <v-row justify="center" v-if="!cargando">
        <v-col cols="12" class="d-flex" sm="6">
          <country-flag class="mr-2 mt-1" :country="codigo" size='big'/>
          <v-select
            :items="items"
            label="Seleccione un país"
            solo
            v-model="codigo"
            @change="obtenerPais"
          >
          </v-select>
        
        </v-col>
      </v-row>
      <div class="contenido" v-if="codigo!=='' && !cargando">
        <v-card full-width color="primary" dark>
          <v-card-title>Ultimos datos de: {{pais.text}}</v-card-title>
          <v-card-text>Seleccione una fecha en el calendario para ver los datos correspondientes a la misma.</v-card-text>
        </v-card>
        <v-row v-if="datos">
          <v-col cols="12" md="4">
            <v-date-picker full-width @change="obtenerPais" min="2020-01-01" :max="fechaINT" v-model="picker"></v-date-picker>
          </v-col>
          <v-col cols="12" md="8">
            <v-card color="success" dark>
                <v-card-text ><v-icon class="icon">fas fa-file-medical</v-icon></v-card-text>
                
                <v-card-title :class="datos.Recovered=='Sin resultados'? 'display-none':'display-3'">
                    {{datos.Recovered}}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-title>
                    Recuperados
                </v-card-title>
                <v-card-text>Casos recuperados hasta la fecha</v-card-text>
            </v-card>
            <v-row class="mt-3">
              <v-col cols="12" md='4'>
                  <v-card color="warning" height='100%'>
                    <v-card-text ><v-icon class="icon">fas fa-exclamation-circle</v-icon></v-card-text>
                    <v-card-title :class="datos.Confirmed=='Sin resultados'? 'display-none':'display-3'">
                        {{datos.Confirmed}}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-title>Confirmados</v-card-title>
                    <v-card-text>Casos confirmados hasta la fecha</v-card-text>
                
                  </v-card>
              </v-col>
              <v-col cols="12" md='4'>
                  <v-card color="red" dark  height='100%'>
                    <v-card-text ><v-icon class="icon">fas fa-skull-crossbones</v-icon></v-card-text>
                    <v-card-title :class="datos.Deaths=='Sin resultados'? 'display-none':'display-3'">
                        {{datos.Deaths}}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-title>Muertes</v-card-title>
                    <v-card-text>Casos muertos hasta la fecha</v-card-text>
                
                  </v-card>
              </v-col>
              <v-col cols="12" md='4'>
                  <v-card color="info" dark height='100%'>
                
                    <v-card-text ><v-icon class="icon">fas fa-exclamation-circle</v-icon></v-card-text>
                    <v-card-title :class="datos.Active=='Sin resultados'? 'display-none':'display-3'">
                        {{datos.Active}}
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-title>Activos</v-card-title>
                    <v-card-text>Casos activos hasta la fecha <i>Nota: </i>Los casos activos pueden variar dependiendo si ese día se vieron reflejados los datos de Recuperados y Muertos</v-card-text>
                  </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row class="grafica text-center">
          <v-col cols="12" md="6">
            <h3>Grafíca de reportes de casos confirmados</h3>
            <line-chart class="h-50" :chart-data="datacollectionConfirmed"></line-chart>
          </v-col>
          <v-col cols="12" md="6">
            <h3>Grafíca de reportes de casos recuperados</h3>
            <line-chart class="h-50" :chart-data="datacollectionRecovered"></line-chart>
          </v-col>
          <v-col cols="12" md="6">
            <h3>Grafíca de reportes de casos muertos</h3>
            <line-chart class="h-50" :chart-data="datacollection"></line-chart>
          </v-col>
        </v-row>
       
      </div>
      <v-card height="150">
        <v-footer
          absolute
          class="font-weight-medium"
          color="primary"
          dark
        >
          <v-col
            class="text-center"
            cols="12"
          >
            {{ new Date().getFullYear() }} — <strong>Angel Castillo</strong>
          </v-col>
        </v-footer>
      </v-card>
    </div>
</template>

<script>
import CountryFlag from 'vue-country-flag'
import {mapState,mapActions} from 'vuex'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import LineChart from './LineChart.js'
  export default {
    name: 'Main',
    data(){
      return{
          items:[{text:'Honduras',value:'hn'},{text:'Salvador',value:'sv'},{text:'Guatemala',value:'gt'},{text:'Nicaragua',value:'ni'},{text:'Belice',value:'bz'}],
          codigo:'',
          pais:'',
          picker: new Date().toISOString().substr(0, 10),
          fechaHN:'',
          fechaINT:new Date().toISOString().substr(0, 10),
          cargando:false,
          datos:null,
          datacollection:null,
          datacollectionConfirmed:null,
          datacollectionRecovered:null
      }
    },
    components: {
        CountryFlag,
        PulseLoader,
        LineChart
    },
    computed:{
      ...mapState(['honduras','guatemala','belice','nicaragua','salvador'])
    },
    methods: {
        ...mapActions(['cargarDatos']),
        async obtenerPais(){
          if(this.codigo!==''){
            
            for(let item of this.items){
              if(item.value==this.codigo){
                this.pais = item;
                try{
                  const payload={
                    pais:item.text,
                    fecha: this.picker
                  }
                  this.datos = await this.obtenerDatos(payload);
                  
                  this.datos.Active= (this.datos!==null && this.datos !==undefined && this.datos.Recovered!=='Sin resultados')? parseInt(this.datos.Confirmed) - (parseInt(this.datos.Deaths) + parseInt(this.datos.Recovered)) : 'Sin resultados'
                  
                }catch(err){
                  console.log(err);
                }
                break;
              }
            }
          }
        },
        obtenerDatos(payload) {
            let datos;
            switch (payload.pais) {
                case 'Guatemala':
                    datos = this.recorrerArreloPais(this.guatemala, payload.fecha);
                    this.rellenarGrafico(this.guatemala);
                    return (datos!=null && datos !=undefined)? datos:{Recovered:'Sin resultados',Confirmed:'Sin resultados',Deaths:'Sin resultados'};
                case 'Belice':
                    this.rellenarGrafico(this.belice);
                    datos = this.recorrerArreloPais(this.belice, payload.fecha);
                    return (datos!=null && datos !=undefined)? datos:{Recovered:'Sin resultados',Confirmed:'Sin resultados',Deaths:'Sin resultados'};
                case 'Honduras':
                    this.rellenarGrafico(this.honduras);
                    datos = this.recorrerArreloPais(this.honduras, payload.fecha);
                    return (datos!=null && datos !=undefined)? datos:{Recovered:'Sin resultados',Confirmed:'Sin resultados',Deaths:'Sin resultados'};
                case 'Nicaragua':
                    this.rellenarGrafico(this.nicaragua);
                    datos = this.recorrerArreloPais(this.nicaragua, payload.fecha);
                    return (datos!=null && datos !=undefined)? datos:{Recovered:'Sin resultados',Confirmed:'Sin resultados',Deaths:'Sin resultados'};
                case 'Salvador':
                    this.rellenarGrafico(this.salvador);
                    datos = this.recorrerArreloPais(this.salvador, payload.fecha);
                    return (datos!=null && datos !=undefined)? datos:{Recovered:'Sin resultados',Confirmed:'Sin resultados',Deaths:'Sin resultados'};
            }
        },
        recorrerArreloPais(array,fecha) {
          
            for(let item of array){
                if (item.Date.substr(0, 10) == fecha) {
                    return item;
                }
            }
        },
        convertirFechaHnInt(){
          const nuevaFecha = this.fechaHN.split('/');
          if(nuevaFecha[1].length<=1){
            nuevaFecha[1]= '0'+nuevaFecha[1];
          }
          if(nuevaFecha[0].length<=1){
            nuevaFecha[0]= '0'+nuevaFecha[0];
          }
          return nuevaFecha[2]+'-'+nuevaFecha[1]+'-'+nuevaFecha[0];
        },
        rellenarGrafico (array) {
          let arrayDeaths=[];
          let arrayFechas = [];
          let arrayConfirmed=[];
          let arrayRecovered=[];
          let contador= 0;


          for(let item of array){
            if(contador>=15){
              arrayDeaths.push(item.Deaths);
              arrayFechas.push(item.Date.substr(0,10));
              arrayConfirmed.push(item.Confirmed);
              arrayRecovered.push(item.Recovered);
              contador=0;
              
            }
            contador++;
          }
       
          this.datacollection={
            labels:arrayFechas,
            datasets:[{
              label:'Muertes',
              data:arrayDeaths,
              backgroundColor:'#FF5252'
            }]
          }
          this.datacollectionConfirmed={
            labels:arrayFechas,
            datasets:[{
              label:'Confirmados',
              data:arrayConfirmed,
              backgroundColor:'#FFC107'
            }]
          }
          this.datacollectionRecovered={
            labels:arrayFechas,
            datasets:[{
              label:'Recuperados',
              data:arrayRecovered,
              backgroundColor:'#4CAF50'
            }]
          }
         
        }
    },
    async created(){
      this.cargando = true;
      await this.cargarDatos();
      const fecha = new Date().toLocaleString('es-HN',{timeZone:'America/Tegucigalpa'})
      this.fechaHN = fecha.substring(0,9);
      this.cargando = false;
    },
    mounted () {
      
      
    }

  }
</script>

<style>
  /* .grafica {
    max-width: 600px;
    margin: auto;

  } */
</style>
