import { ref, computed, onMounted } from "vue";

export function useTarifas(showNotification: (arg0: string, arg1: string) => void) {
  const tarifas = ref([]);
  const localTarifas = ref([]);
  const selectedTarifa = ref(null);
  const searchId = ref('');
  const searchAttempted = ref(false);

  const allTarifas = computed(() => {
    const apiIds = tarifas.value.map(t => t.idTarifa);
    const filteredLocal = localTarifas.value.filter(t => !apiIds.includes(t.idTarifa));
    return [...tarifas.value, ...filteredLocal];
  });

  const fetchTarifas = async (idTarifa = '') => {
    try {
      const response = await fetch("https://ebind-dev.egl-cloud.com/dgs-api-bridge/tarifas/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idTarifa })
      });
  
      if (!response.ok) throw new Error(`Error al consultar tarifa: ${response.status}`);
  
      const data = await response.json();
  
      const result = data?.response?.tarifas ?? [];
      tarifas.value = result;
  
      return result;
    } catch (error) {
      console.error("Error al obtener tarifas:", error);
      showNotification('Error al consultar tarifa en el servidor', 'error');
      return null;
    }
  };
  

  const saveLocalTarifas = () => {
    localStorage.setItem('localTarifas', JSON.stringify(localTarifas.value));
  };

  const searchTarifa = async () => {
    searchAttempted.value = true;
    const id = searchId.value.trim();
  
    if (!id) {
      showNotification('Por favor ingrese un ID de tarifa', 'error');
      return;
    }
  
    // Buscar localmente
    let found = findTarifaLocal(id);
  
    // Si no se encuentra, buscar en backend
    if (!found) {
      const result = await fetchTarifas(id);
      if (result && result.length > 0) {
        found = result.find(t => t.idTarifa === id);
      }
    }
  
    // Mostrar resultado
    if (found) {
      selectedTarifa.value = found;
      showNotification('Tarifa encontrada', 'success');
    } else {
      selectedTarifa.value = null;
      showNotification('No se encontró la tarifa con el ID especificado', 'error');
    }
  };
  
  const findTarifaLocal = (id) => {
    return tarifas.value.find(t => t.idTarifa === id) ||
           localTarifas.value.find(t => t.idTarifa === id);
  };
  
  const loadLocalTarifas = () => {
    const stored = localStorage.getItem('localTarifas');
    if (stored) {
      try {
        localTarifas.value = JSON.parse(stored);
      } catch (e) {
        console.error('Error al cargar tarifas locales:', e);
      }
    }
  };


  onMounted(() => {
    loadLocalTarifas();
    // fetchTarifas();
  });

  return {
    tarifas: allTarifas,
    selectedTarifa,
    searchId,
    searchAttempted,
    searchTarifa,
    selectTarifa: (tarifa: null) => selectedTarifa.value = tarifa,
    localTarifas,
    saveLocalTarifas,
    fetchTarifas
  };
}
