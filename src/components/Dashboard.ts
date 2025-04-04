import { ref } from 'vue';
import { useFormatters } from '../composables/useFormatters';
import { useNotificaciones } from '../composables/useNotificaciones';
import { useTarifaForm } from '../composables/useTarifaForm';
import { useTarifas } from '../composables/useTarifas';

export default {
  name: 'Dashboard',
  setup() {
    const activeTab = ref('consulta');
    const {
      notification,
      showNotification
    } = useNotificaciones();
    const {
      tarifas,
      selectedTarifa,
      searchId,
      searchAttempted,
      searchTarifa,
      selectTarifa,
      localTarifas,
      saveLocalTarifas
    } = useTarifas(showNotification);

    const {
      newTarifa,
      aplicativosInput,
      errors,
      saveTarifa,
      resetForm
    } = useTarifaForm(
      tarifas,
      localTarifas,
      saveLocalTarifas,
      showNotification
    );

    const { formatDate, formatCurrency } = useFormatters();

    return {
      activeTab,
      tarifas,
      selectedTarifa,
      searchId,
      searchAttempted,
      searchTarifa,
      selectTarifa,
      newTarifa,
      aplicativosInput,
      errors,
      saveTarifa,
      resetForm,
      notification,
      formatDate,
      formatCurrency
    };
  }
}
