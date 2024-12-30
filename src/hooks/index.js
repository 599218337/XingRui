import { reactive, onBeforeMount, ref } from "vue";

/**
 * 获取body的宽度和高度
 *
 * @export
 * @return {*} 
 */
export function useVwSize() {
    const data = reactive({
        width: 0,
        height: 0
    })
    const getViewportSize = () => {
        data.width = document.body.clientWidth;
        data.height = document.body.clientHeight;
    }
    return {
        data, getViewportSize
    }
}
/**
 *  倒计时
 *  @param {Number} second 倒计时秒数
 *  @return {Number} count 倒计时秒数
 *  @return {Function} countDown 倒计时函数
 *  @example
 *  const { count, countDown } = useCountDown()
 *  countDown(60)
 * <div>{{ count }}</div>
 */
export function useCountDown() {
    const count = ref(0);
    const timer = ref(null);
    const countDown = (second, ck) => {
        console.log('count.value=', count.value);
        console.log('timer.value=', timer.value);
        if (count.value === 0 && timer.value === null) {
            ck();
            count.value = second;
            timer.value = setInterval(() => {
                count.value--;
                if (count.value === 0) { 
                    clearInterval(timer.value);
                    timer.value = null;
                }
            }, 1000);
        }
    };
    onBeforeMount(() => {
        timer.value && clearInterval(timer.value);
    });
    return {
        count,
        countDown,
    };
}

/**
 * @params {Function} fn  需要防抖的函数 delay 防抖时间
 * @returns {Function} debounce 防抖函数
 * @example  
 * const { debounce } = useDebounce()
 * const fn = () => { console.log('防抖') }
 * const debounceFn = debounce(fn, 1000)
 * debounceFn()
 * 
 */
 export function useDebounce() {
    const debounce = (fn, delay) => {
      let timer = null;
      return function () {
        if (timer)  clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(this, arguments);
        }, delay);
      };
    };
    return { debounce };
 }
 /** 
  * 
    <script setup lang="ts">
    import { useDebounce } from "@/hooks";
    // 防抖
    const { debounce } = useDebounce()
    const fn = () => {
       console.log('点击了哈');
    }
    const debounceClick =  debounce(fn,1000)
    <button @click="debounceClick">防抖点击</button>
    </script>
 */


/**
 * @params {Function} fn  需要节流的函数 delay 节流时间
 * @returns {Function} throttle 节流函数
 * @example
 * const { throttle } = useThrottle()
 * const fn = () => { console.log('节流') }
 * const throttleFn = throttle(fn, 1000)
 * throttleFn()
 *  
 * 
 *  */
 export function useThrottle() {
    const throttle = (fn, delay) => {
      let timer = null;
      return function () {
        if (!timer) {
          timer = setTimeout(() => {
            fn.apply(this, arguments);
            timer = null;
          }, delay);
        }
      };
    };
    return { throttle };
 }
  /** 
   <script setup lang="ts">
    import { useThrottle} from "@/hooks";
    const fn = () => {
    console.log('点击了哈');
    }
    const { throttle } = useThrottle()
    const throttleClick =  throttle(fn,1000)
    </script>
    <button @click="throttleClick">节流点击</button>
  */