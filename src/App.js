
import './App.css';
import { PersistGate } from 'redux-persist/integration/react';
import React,{ useEffect } from 'react';
import { store, persistor } from './redux/store';
import IndexRouter from './router/IndexRouter';
import { Provider } from 'react-redux';
import { useState } from 'react';

function App() {
    // const [myState, setMyState] =     useState(0);
    // useEffect(() => {
        // console.log('fsdf');
        /*
    const timing = window.performance.timing;
    const navTimes = performance.getEntriesByType('navigation')
    console.log(navTimes)

    // 组件挂载耗时
    const mountTime = timing.domContentLoadedEventEnd - timing.navigationStart;
    console.log("Mount Time:", mountTime);

    // 组件渲染耗时
    const renderTimeStart = window.performance.now();
    setMyState(myState + 1); // 修改State以触发组件重新渲染
    const renderTimeEnd = window.performance.now();
    const renderTime = renderTimeEnd - renderTimeStart;
    console.log("Render Time:", renderTime);
    */
        // axios.get("/ajax/api/mmdb/movie/v3/list/hot.json?ct=%E6%B1%95%E5%A4%B4&ci=117&channelId=4").then(
        //   res => {
        //     console.log(res.data);
        //   }
        // )

        // 存储页面性能指标信息的数组
    //     var performanceData = [];

    //     // 定义一个记录页面性能指标的函数
    //     function recordPerformance() {
    //         // 从 performance.timing 对象中获取页面性能指标
    //         var ttfb = performance.timing.responseStart - performance.timing.requestStart;
    //         var loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    //         var fcp = performance.getEntriesByName('first-contentful-paint')[0].startTime;
    //         // var timeToInteractive = /* ...计算交互时间的逻辑... */;

    //         // 将这些指标信息存入数组中
    //         performanceData.push({
    //             ttfb: ttfb,
    //             loadTime: loadTime,
    //             fcp: fcp,
    //             // timeToInteractive: timeToInteractive
    //         });
    //     }

    //     // 每隔 1 秒钟记录一遍页面性能指标
    //     setInterval(recordPerformance, 2000);

    //     console.log(performanceData);
    // }, []);


    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <IndexRouter></IndexRouter>
            </PersistGate>
        </Provider>
        // <div className='aa'>
        //     <div className='bb'></div>
        // </div>
    );
}

export default App;
