<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Object,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  methods: {
    getBar() {
      let xAxisData = Object.keys(this.value)
      console.log(this.value);
      let seriesData = Object.values(this.value)
      let option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}单'
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel : {//坐标轴刻度标签的相关设置。
                interval:0,
                rotate:"25"
            }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: seriesData,
            type: "bar",
            barWidth: 20,
            itemStyle: {
              normal: { color: "rgba(0,0,0,0.05)" }
            },
            barGap: "-100%",
            barCategoryGap: "40%"
          },

          {
            type: "bar",
            barWidth: 20,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ])
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            // label: {
            //   show: true,
            //   position: "top",
            //   // 标签的文字。
            //   formatter: "{c}户"
            // },
            data: seriesData
          }
        ]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    },
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getBar();
    })
  },
  watch: {
    value(val) {
      console.log(val);
      this.getBar();
    }
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
