import * as DiagramService from "../../service/DiagramService"
import React, { useState } from 'react';
import { useEffect } from "react";

function DiagramCard() {
    const [data, setData] = useState()

    useEffect(async () => {
        try {
            const res = await DiagramService.listDiagram()
            // console.log(res)
            // setData(res.data)
        } catch (error) {
            // console.log(error)
        }
    }, [])
    return (
        <div>
        </div>
    )
}
export default DiagramCard;