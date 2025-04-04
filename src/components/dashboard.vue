<script lang="ts" src="./dashboard.ts"/>

<template>
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Gestión de Tarifas</h1>
      
      <!-- Tabs para navegación entre vistas -->
      <div class="flex border-b border-gray-200 mb-6">
        <button 
          @click="activeTab = 'consulta'"
          :class="[
            'py-2 px-4 font-medium',
            activeTab === 'consulta' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          ]"
        >
          Consulta
        </button>
        <button 
          @click="activeTab = 'alta'"
          :class="[
            'py-2 px-4 font-medium',
            activeTab === 'alta' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
          ]"
        >
          Alta
        </button>
      </div>
      
      <!-- Vista de Consulta -->
      <div v-if="activeTab === 'consulta'" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Consulta de Tarifas</h2>
        
        <!-- Buscador -->
        <div class="flex mb-6">
          <input 
            v-model="searchId" 
            type="text" 
            placeholder="Buscar por ID" 
            class="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            @click="searchTarifa" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-r-lg transition"
          >
            Buscar
          </button>
        </div>
        
        <!-- Resultados de búsqueda -->
        <div v-if="selectedTarifa">
          <h3 class="text-lg font-semibold mb-3">Información de Tarifa</h3>
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500">ID Tarifa</p>
                <p class="font-medium">{{ selectedTarifa.idTarifa }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarifa</p>
                <p class="font-medium">{{ selectedTarifa.tarifa }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Concepto</p>
                <p class="font-medium">{{ selectedTarifa.concepto }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Estatus</p>
                <p class="font-medium">{{ selectedTarifa.estatus.descripcion }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tipo Producto</p>
                <p class="font-medium">{{ selectedTarifa.tipoProducto }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tipo Documento</p>
                <p class="font-medium">{{ selectedTarifa.tipoDocumento.descripcion }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Período</p>
                <p class="font-medium">{{ selectedTarifa.diaInicio }} - {{ selectedTarifa.diaFin }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Importe</p>
                <p class="font-medium">{{ formatCurrency(selectedTarifa.importe) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Última Modificación</p>
                <p class="font-medium">{{ formatDate(selectedTarifa.fh_ultima_modificacion) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Aplicativos</p>
                <p class="font-medium">{{ selectedTarifa.aplicativos.join(', ') }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Listado de todas las tarifas -->
        <div v-if="tarifas.length > 0">
          <h3 class="text-lg font-semibold mb-3">Listado de Tarifas</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarifa</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="tarifa in tarifas" :key="tarifa.idTarifa" class="hover:bg-gray-50">
                  <td class="px-4 py-2">{{ tarifa.idTarifa }}</td>
                  <td class="px-4 py-2">{{ tarifa.tarifa }}</td>
                  <td class="px-4 py-2">{{ tarifa.concepto }}</td>
                  <td class="px-4 py-2">{{ formatCurrency(tarifa.importe) }}</td>
                  <td class="px-4 py-2">
                    <button 
                      @click="selectTarifa(tarifa)"
                      class="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Mensaje cuando no hay resultados -->
        <div v-else-if="searchAttempted" class="text-center p-4">
          <p class="text-gray-500">No se encontraron tarifas</p>
        </div>
      </div>
      
      <!-- Vista de Alta -->
      <div v-if="activeTab === 'alta'" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Alta de Tarifa</h2>
        
        <form @submit.prevent="saveTarifa" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ID Tarifa</label>
              <input 
                v-model="newTarifa.idTarifa" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.idTarifa}"
              />
              <p v-if="errors.idTarifa" class="text-red-500 text-xs mt-1">{{ errors.idTarifa }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarifa</label>
              <input 
                v-model="newTarifa.tarifa" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.tarifa}"
              />
              <p v-if="errors.tarifa" class="text-red-500 text-xs mt-1">{{ errors.tarifa }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
              <input 
                v-model="newTarifa.concepto" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.concepto}"
              />
              <p v-if="errors.concepto" class="text-red-500 text-xs mt-1">{{ errors.concepto }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
              <select 
                v-model="newTarifa.estatus" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.estatus}"
              >
                <option value="" disabled>Seleccione un estatus</option>
                <option :value="{ id: 1, descripcion: 'Activo' }">Activo</option>
                <option :value="{ id: 2, descripcion: 'Inactivo' }">Inactivo</option>
              </select>
              <p v-if="errors.estatus" class="text-red-500 text-xs mt-1">{{ errors.estatus }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Producto</label>
              <input 
                v-model="newTarifa.tipoProducto" 
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.tipoProducto}"
              />
              <p v-if="errors.tipoProducto" class="text-red-500 text-xs mt-1">{{ errors.tipoProducto }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Documento</label>
              <select 
                v-model="newTarifa.tipoDocumento" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.tipoDocumento}"
              >
                <option value="" disabled>Seleccione un tipo</option>
                <option :value="{ id: 1, descripcion: 'Factura' }">Factura</option>
                <option :value="{ id: 2, descripcion: 'Recibo' }">Recibo</option>
                <option :value="{ id: 3, descripcion: 'Nota' }">Nota</option>
              </select>
              <p v-if="errors.tipoDocumento" class="text-red-500 text-xs mt-1">{{ errors.tipoDocumento }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Día Inicio</label>
              <input 
                v-model="newTarifa.diaInicio" 
                type="number" 
                min="1" 
                max="31" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.diaInicio}"
              />
              <p v-if="errors.diaInicio" class="text-red-500 text-xs mt-1">{{ errors.diaInicio }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Día Fin</label>
              <input 
                v-model="newTarifa.diaFin" 
                type="number" 
                min="1" 
                max="31" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.diaFin}"
              />
              <p v-if="errors.diaFin" class="text-red-500 text-xs mt-1">{{ errors.diaFin }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Importe</label>
              <input 
                v-model="newTarifa.importe" 
                type="number" 
                step="0.01" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.importe}"
              />
              <p v-if="errors.importe" class="text-red-500 text-xs mt-1">{{ errors.importe }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Aplicativos (separados por coma)</label>
              <input 
                v-model="aplicativosInput" 
                type="text" 
                placeholder="app1, app2, app3" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{'border-red-500': errors.aplicativos}"
              />
              <p v-if="errors.aplicativos" class="text-red-500 text-xs mt-1">{{ errors.aplicativos }}</p>
            </div>
          </div>
          
          <div class="flex justify-end pt-4">
            <button 
              type="button" 
              @click="resetForm" 
              class="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
      
      <!-- Notificaciones -->
      <div 
        v-if="notification.show" 
        class="fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg transition transform duration-300"
        :class="{
          'bg-green-500 text-white': notification.type === 'success',
          'bg-red-500 text-white': notification.type === 'error',
          'bg-blue-500 text-white': notification.type === 'info',
          'translate-y-0': notification.show,
          'translate-y-20': !notification.show
        }"
      >
        {{ notification.message }}
      </div>
    </div>
  </template>