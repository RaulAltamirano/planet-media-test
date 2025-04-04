<script lang="ts" src="./Dashboard.ts" />


<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">Gestión de Tarifas</h1>

    <!-- Tabs para navegación entre vistas -->
    <div class="flex border-b-2 border-gray-200 mb-8">
      <button @click="activeTab = 'consulta'" :class="[
        'py-3 px-6 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        activeTab === 'consulta' ? 'border-b-3 border-blue-600 text-blue-700 font-semibold' : 'text-gray-600 hover:text-blue-500'
      ]" aria-controls="consulta-panel" :aria-selected="activeTab === 'consulta'" role="tab">
        Consulta
      </button>
      <button @click="activeTab = 'alta'" :class="[
        'py-3 px-6 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        activeTab === 'alta' ? 'border-b-3 border-blue-600 text-blue-700 font-semibold' : 'text-gray-600 hover:text-blue-500'
      ]" aria-controls="alta-panel" :aria-selected="activeTab === 'alta'" role="tab">
        Alta
      </button>
    </div>

    <!-- Vista de Consulta -->
    <div v-if="activeTab === 'consulta'" id="consulta-panel" role="tabpanel" aria-labelledby="consulta-tab"
      class="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Consulta de Tarifas</h2>

      <!-- Buscador -->
      <div class="flex mb-8">
        <div class="relative flex-1">
          <input v-model="searchId" type="text" placeholder="Buscar por ID"
            class="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            aria-label="Buscar tarifa por ID" />
        </div>
        <button @click="searchTarifa"
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-r-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Iniciar búsqueda">
          Buscar
        </button>
      </div>

      <!-- Resultados de búsqueda -->
      <div v-if="selectedTarifa" class="mb-10">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Información de Tarifa</h3>
        <div class="bg-gray-50 p-6 rounded-lg mb-4 border border-gray-100 shadow-sm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">ID Tarifa</p>
              <p class="font-semibold text-gray-900">{{ selectedTarifa.idTarifa }}</p>
            </div>
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">Tarifa</p>
              <p class="font-semibold text-gray-900">{{ selectedTarifa.tarifa }}</p>
            </div>
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">Concepto</p>
              <p class="font-semibold text-gray-900">{{ selectedTarifa.concepto }}</p>
            </div>
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">Estatus</p>
              <p class="font-semibold text-gray-900">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="selectedTarifa.estatus.descripcion === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ selectedTarifa.estatus.descripcion }}
                </span>
              </p>
            </div>
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">Tipo Producto</p>
              <p class="font-semibold text-gray-900">{{ selectedTarifa.tipoProducto }}</p>
            </div>
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">Tipo Documento</p>
              <p class="font-semibold text-gray-900">{{ selectedTarifa.tipoDocumento.descripcion }}</p>
            </div>
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">Período</p>
              <p class="font-semibold text-gray-900">{{ selectedTarifa.diaInicio }} - {{ selectedTarifa.diaFin }}</p>
            </div>
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">Importe</p>
              <p class="font-semibold text-gray-900 text-lg">{{ formatCurrency(selectedTarifa.importe) }}</p>
            </div>
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">Última Modificación</p>
              <p class="font-semibold text-gray-900">{{ formatDate(selectedTarifa.fh_ultima_modificacion) }}</p>
            </div>
            <div class="transition-all duration-200 hover:bg-gray-100 p-3 rounded-md">
              <p class="text-sm font-medium text-gray-500 mb-1">Aplicativos</p>
              <div class="flex flex-wrap gap-1">
                <span v-for="(app, index) in selectedTarifa.aplicativos" :key="index"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ app }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Listado de todas las tarifas -->
      <div v-if="tarifas.length > 0">
        <h3 class="text-xl font-semibold mb-4 text-gray-800">Listado de Tarifas</h3>
        <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarifa</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concepto</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importe</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tarifa in tarifas" :key="tarifa.idTarifa" class="transition-colors hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ tarifa.idTarifa }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ tarifa.tarifa }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700">{{ tarifa.concepto }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{{ formatCurrency(tarifa.importe) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button @click="selectTarifa(tarifa)"
                    class="text-blue-600 hover:text-blue-800 font-medium p-2 rounded hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Ver detalles de tarifa">
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mensaje cuando no hay resultados -->
      <div v-else-if="searchAttempted" class="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <p class="text-gray-600 text-lg">No se encontraron tarifas</p>
      </div>
    </div>

    <!-- Vista de Alta -->
    <div v-if="activeTab === 'alta'" id="alta-panel" role="tabpanel" aria-labelledby="alta-tab"
      class="bg-white rounded-lg shadow-md p-6 transition-all duration-300">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Alta de Tarifa</h2>

      <form @submit.prevent="saveTarifa" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="idTarifa" class="block text-sm font-medium text-gray-700 mb-2">ID Tarifa</label>
            <input id="idTarifa" v-model="newTarifa.idTarifa" type="text"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.idTarifa }" />
            <p v-if="errors.idTarifa" class="text-red-600 text-sm mt-1">{{ errors.idTarifa }}</p>
          </div>

          <div>
            <label for="tarifa" class="block text-sm font-medium text-gray-700 mb-2">Tarifa</label>
            <input id="tarifa" v-model="newTarifa.tarifa" type="text"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.tarifa }" />
            <p v-if="errors.tarifa" class="text-red-600 text-sm mt-1">{{ errors.tarifa }}</p>
          </div>

          <div>
            <label for="concepto" class="block text-sm font-medium text-gray-700 mb-2">Concepto</label>
            <input id="concepto" v-model="newTarifa.concepto" type="text"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.concepto }" />
            <p v-if="errors.concepto" class="text-red-600 text-sm mt-1">{{ errors.concepto }}</p>
          </div>

          <div>
            <label for="estatus" class="block text-sm font-medium text-gray-700 mb-2">Estatus</label>
            <select id="estatus" v-model="newTarifa.estatus"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.estatus }">
              <option value="" disabled>Seleccione un estatus</option>
              <option :value="{ id: 1, descripcion: 'Activo' }">Activo</option>
              <option :value="{ id: 2, descripcion: 'Inactivo' }">Inactivo</option>
            </select>
            <p v-if="errors.estatus" class="text-red-600 text-sm mt-1">{{ errors.estatus }}</p>
          </div>

          <div>
            <label for="tipoProducto" class="block text-sm font-medium text-gray-700 mb-2">Tipo Producto</label>
            <input id="tipoProducto" v-model="newTarifa.tipoProducto" type="text"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.tipoProducto }" />
            <p v-if="errors.tipoProducto" class="text-red-600 text-sm mt-1">{{ errors.tipoProducto }}</p>
          </div>

          <div>
            <label for="tipoDocumento" class="block text-sm font-medium text-gray-700 mb-2">Tipo Documento</label>
            <select id="tipoDocumento" v-model="newTarifa.tipoDocumento"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.tipoDocumento }">
              <option value="" disabled>Seleccione un tipo</option>
              <option :value="{ id: 1, descripcion: 'Factura' }">Factura</option>
              <option :value="{ id: 2, descripcion: 'Recibo' }">Recibo</option>
              <option :value="{ id: 3, descripcion: 'Nota' }">Nota</option>
            </select>
            <p v-if="errors.tipoDocumento" class="text-red-600 text-sm mt-1">{{ errors.tipoDocumento }}</p>
          </div>

          <div>
            <label for="diaInicio" class="block text-sm font-medium text-gray-700 mb-2">Día Inicio</label>
            <input id="diaInicio" v-model="newTarifa.diaInicio" type="number" min="1" max="31"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.diaInicio }" />
            <p v-if="errors.diaInicio" class="text-red-600 text-sm mt-1">{{ errors.diaInicio }}</p>
          </div>

          <div>
            <label for="diaFin" class="block text-sm font-medium text-gray-700 mb-2">Día Fin</label>
            <input id="diaFin" v-model="newTarifa.diaFin" type="number" min="1" max="31"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.diaFin }" />
            <p v-if="errors.diaFin" class="text-red-600 text-sm mt-1">{{ errors.diaFin }}</p>
          </div>

          <div>
            <label for="importe" class="block text-sm font-medium text-gray-700 mb-2">Importe</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input id="importe" v-model="newTarifa.importe" type="number" step="0.01"
                class="w-full pl-8 px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.importe }" />
            </div>
            <p v-if="errors.importe" class="text-red-600 text-sm mt-1">{{ errors.importe }}</p>
          </div>

          <div>
            <label for="aplicativos" class="block text-sm font-medium text-gray-700 mb-2">Aplicativos (separados por
              coma)</label>
            <input id="aplicativos" v-model="aplicativosInput" type="text" placeholder="app1, app2, app3"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.aplicativos }" />
            <p v-if="errors.aplicativos" class="text-red-600 text-sm mt-1">{{ errors.aplicativos }}</p>
          </div>
        </div>

        <div class="flex justify-end pt-6 border-t border-gray-200">
          <button type="button" @click="resetForm"
            class="mr-4 px-6 py-3 border-2 border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Cancelar
          </button>
          <button type="submit"
            class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Guardar
          </button>
        </div>
      </form>
    </div>

    <!-- Notificaciones -->
    <div v-if="notification.show"
      class="fixed bottom-4 right-4 px-6 py-4 rounded-md shadow-lg transition-all transform duration-300 max-w-md flex items-center"
      :class="{
        'bg-green-600 text-white': notification.type === 'success',
        'bg-red-600 text-white': notification.type === 'error',
        'bg-blue-600 text-white': notification.type === 'info',
        'translate-y-0 opacity-100': notification.show,
        'translate-y-20 opacity-0': !notification.show
      }" role="alert" aria-live="assertive">
      {{ notification.message }}
    </div>
  </div>
</template>