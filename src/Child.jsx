import style from './Child.module.scss';
import React,{ useEffect } from 'react';
function Child() {
    return <div>
        <ul>
            <li className={style.item}>
                child---111
            </li>
            <li className={style.item}>child---222</li>


        </ul>
    </div>;
}
export default Child;