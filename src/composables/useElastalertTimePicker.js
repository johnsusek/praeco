import { ref } from 'vue';

export function useElastalertTimePicker(props, emit) {
  const currentUnit = ref(props.unit);
  const currentAmount = ref(props.amount);

  const emitNumKeyup = () => {
    emit('num-keyup', currentAmount.value);
  };

  const emitValue = () => {
    emit('update:value', {
      amount: currentAmount.value,
      unit: currentUnit.value,
    });
  };

  const plural = () => {
    return currentAmount.value !== 1 ? 's' : '';
  };

  return {
    currentUnit,
    currentAmount,
    emitNumKeyup,
    emitValue,
    plural,
  };
}
