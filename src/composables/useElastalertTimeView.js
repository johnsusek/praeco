import { ref, watch, onMounted } from 'vue';

export function useElastalertTimeView(props) {
  const value = ref('999');
  const unit = ref('seconds');

  const updateTime = () => {
    if (!props.time || !Object.values(props.time).length) return;

    value.value = Object.values(props.time)[0];

    let u = Object.keys(props.time)[0];

    if (value.value <= 1 && unit.value) {
      u = u.slice(0, -1);
    }

    unit.value = u;
  };

  watch(
    () => props.time,
    () => {
      updateTime();
    },
    { deep: true }
  );

  onMounted(() => {
    updateTime();
  });

  return {
    value,
    unit,
    updateTime
  };
}
