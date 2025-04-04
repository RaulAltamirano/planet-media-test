import { reactive, ref } from "vue";

export function useTarifaForm(tarifas: { value: any[]; }, localTarifas: { value: { fh_ultima_modificacion: string; idTarifa: string; tarifa: string; concepto: string; estatus: string; tipoProducto: string; tipoDocumento: string; diaInicio: string; diaFin: string; importe: string; aplicativos: never[]; }[]; }, saveLocalTarifas: () => void, showNotification: (arg0: string, arg1: string) => void) {
  const newTarifa = reactive({
    idTarifa: '',
    tarifa: '',
    concepto: '',
    estatus: '',
    tipoProducto: '',
    tipoDocumento: '',
    diaInicio: '',
    diaFin: '',
    importe: '',
    fh_ultima_modificacion: '',
    aplicativos: []
  });

  const aplicativosInput = ref('');
  const errors = reactive({});

  const validateForm = () => {
    errors.idTarifa = !newTarifa.idTarifa ? 'El ID es requerido' : '';
    errors.tarifa = !newTarifa.tarifa ? 'La tarifa es requerida' : '';
    errors.concepto = !newTarifa.concepto ? 'El concepto es requerido' : '';
    errors.estatus = !newTarifa.estatus ? 'El estatus es requerido' : '';
    errors.tipoProducto = !newTarifa.tipoProducto ? 'El tipo de producto es requerido' : '';
    errors.tipoDocumento = !newTarifa.tipoDocumento ? 'El tipo de documento es requerido' : '';
    errors.diaInicio = !newTarifa.diaInicio ? 'El día de inicio es requerido' : 
                       (newTarifa.diaInicio < 1 || newTarifa.diaInicio > 31) ? 'Día inválido' : '';
    errors.diaFin = !newTarifa.diaFin ? 'El día de fin es requerido' : 
                    (newTarifa.diaFin < 1 || newTarifa.diaFin > 31) ? 'Día inválido' : '';
    errors.importe = !newTarifa.importe ? 'El importe es requerido' : '';

    return Object.values(errors).every(e => e === '');
  };

  const resetForm = () => {
    Object.keys(newTarifa).forEach(k => {
      newTarifa[k] = (k === 'aplicativos') ? [] : '';
    });
    aplicativosInput.value = '';
    Object.keys(errors).forEach(k => errors[k] = '');
  };

  const saveTarifa = () => {
    newTarifa.aplicativos = aplicativosInput.value
      .split(',').map(a => a.trim()).filter(a => a);

    if (!validateForm()) {
      return showNotification('Por favor, complete todos los campos requeridos correctamente', 'error');
    }

    const exists = tarifas.value.some((t: { idTarifa: string; }) => t.idTarifa === newTarifa.idTarifa) ||
                   localTarifas.value.some((t: { idTarifa: string; }) => t.idTarifa === newTarifa.idTarifa);

    if (exists) {
      return showNotification(`Ya existe una tarifa con el ID ${newTarifa.idTarifa}`, 'error');
    }

    const tarifaToSave = {
      ...newTarifa,
      fh_ultima_modificacion: new Date().toISOString()
    };

    localTarifas.value.push(tarifaToSave);
    saveLocalTarifas();
    showNotification('Tarifa guardada exitosamente', 'success');
    resetForm();
  };

  return {
    newTarifa,
    aplicativosInput,
    errors,
    saveTarifa,
    resetForm
  };
}
