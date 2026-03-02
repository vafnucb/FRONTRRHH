<template>
  <div class="month-picker">
    <div class="month-grid">
      <div
        v-for="month in 12"
        :key="month"
        class="month-item"
        :class="{ selected: isMonthSelected(month, currentYear) }"
        @click="toggleMonth(month, currentYear)">
        <div class="month-name">{{ getMonthName(month) }}</div>
        <div class="month-year">{{ currentYear }}</div>
      </div>
    </div>

    <div class="year-controls">
      <button class="btn btn-sm btn-default" @click="previousYear">
        <i class="fa fa-chevron-left"></i> {{ currentYear - 1 }}
      </button>
      <span class="current-year">{{ currentYear }}</span>
      <button class="btn btn-sm btn-default" @click="nextYear">
        {{ currentYear + 1 }} <i class="fa fa-chevron-right"></i>
      </button>
    </div>

    <div v-if="selectedMonths.length > 0" class="selected-summary">
      <strong>Seleccionados:</strong>
      <span v-for="(month, index) in selectedMonths" :key="index" class="badge badge-info">
        {{ getMonthName(month.Mes) }} {{ month.Anio }}
        <i class="fa fa-times" @click="removeMonth(month)" style="cursor: pointer; margin-left: 5px;"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthPicker',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      currentYear: new Date().getFullYear(),
      selectedMonths: []
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        if (newVal && newVal.length > 0) {
          this.selectedMonths = [...newVal]
        }
      }
    }
  },
  methods: {
    getMonthName (month) {
      const months = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      return months[month] || ''
    },
    
    isMonthSelected (month, year) {
      return this.selectedMonths.some(m => m.Mes === month && m.Anio === year)
    },
    
    toggleMonth (month, year) {
      const index = this.selectedMonths.findIndex(m => m.Mes === month && m.Anio === year)
      
      if (index > -1) {
        // Remove
        this.selectedMonths.splice(index, 1)
      } else {
        // Add
        this.selectedMonths.push({
          Mes: month,
          Anio: year,
          Orden: this.selectedMonths.length + 1,
          PorcentajePorDefecto: 0,
          Descripcion: ''
        })
      }
      
      // Sort by date
      this.selectedMonths.sort((a, b) => {
        if (a.Anio !== b.Anio) return a.Anio - b.Anio
        return a.Mes - b.Mes
      })
      
      // Update orden
      this.selectedMonths.forEach((m, i) => {
        m.Orden = i + 1
      })
      
      this.$emit('update', this.selectedMonths)
    },
    
    removeMonth (month) {
      const index = this.selectedMonths.findIndex(m => m.Mes === month.Mes && m.Anio === month.Anio)
      if (index > -1) {
        this.selectedMonths.splice(index, 1)
        this.$emit('update', this.selectedMonths)
      }
    },
    
    previousYear () {
      this.currentYear--
    },
    
    nextYear () {
      this.currentYear++
    }
  }
}
</script>

<style scoped>
.month-picker {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  background: #fff;
}

.month-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.month-item {
  padding: 15px;
  text-align: center;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.month-item:hover {
  border-color: #1c3b6c;
  background: #f0f0f0;
}

.month-item.selected {
  background: #1c3b6c;
  border-color: #1c3b6c;
  color: white;
}

.month-name {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
}

.month-year {
  font-size: 11px;
  opacity: 0.7;
}

.year-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-top: 1px solid #eee;
}

.current-year {
  font-size: 18px;
  font-weight: bold;
  color: #1c3b6c;
}

.selected-summary {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.selected-summary .badge {
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 5px 10px;
  font-size: 12px;
  background: #1c3b6c;
  color: white;
  border-radius: 3px;
  display: inline-block;
}
</style>