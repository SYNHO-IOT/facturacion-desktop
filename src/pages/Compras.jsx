import React, { useEffect, useState } from 'react'
import { SearchByDatePucharse, SearchPucharse, ShowCompras } from '../services/compras';
import ReactHTMLTabletToExcel from 'react-html-table-to-excel';
import { SiMicrosoftexcel } from 'react-icons/si'
import { RiFileAddLine } from 'react-icons/ri'
import { Link } from 'react-router-dom';
import { ImSearch } from 'react-icons/im'
import { CgDetailsMore } from 'react-icons/cg'
import '../assets/css/Ventas.css'

const Compras = () => {

    const [compras, setCompras] = useState([])
    const [dateStart, setDateStart] = useState("")
    const [dateEnd, setDateEnd] = useState("")
    const [total, setTotal] = useState(0)
    const [totalRegister, setTotalRegister] = useState(0)

    const funcSumTotal = async (c) => {
        let sumTotal = 0
        for (let i = 0; i < c.length; i++) {
            const element = c[i];
            sumTotal += element.tb_total
            sumTotal += element.tb_total_dolar
        }
        sumTotal = parseInt(sumTotal * 1000) / 1000
        setTotal(sumTotal)
        setTotalRegister(c.length)
    }   
 
    const getCompras = async () => {
        const result = await ShowCompras()
        if (result.statusText === "OK") {
            setCompras(result.data)
        }else{
            setCompras([])
        }
    }

    const filterDate = async (desde, hasta) => {
        if (desde !== "" && hasta !== "") {
            const d = new Date(dateStart.target.value).toISOString().slice(0,10)
            const h = new Date(dateEnd.target.value).toISOString().slice(0,10)
            const result = await SearchByDatePucharse(d, h);
            if (result.statusText === "OK") {
                setCompras(result.data)
            }else{
                setCompras([])
            }
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        const search = event.target.search_compra.value;
        if (search !== "") {
            const result = await SearchPucharse(search);
            if (result.statusText === "OK") {
                setCompras(result.data)
            }else{
                setCompras([])
            }
        }else{
            getCompras()
        }
    }

    useEffect(() => {
        filterDate(dateStart, dateEnd)
    }, [dateStart, dateEnd])

    useEffect(() => {
        getCompras()
    }, [])

    useEffect(() => {
        funcSumTotal(compras)
    }, [compras])

    return (
        <div className="container-page">
            <div className="container-title-operations">
                <h1>Registro de compras </h1>
            </div>

            <div className="container-all-filters">
                <form className="container-search-filter" onSubmit={onSubmit}>
                    <label htmlFor="search_compra">
                        Buscar: <br />
                        <div className="container-input-search">
                            <input type="search" name="search_compra" id="search_compra" />
                            <button type="submit"><ImSearch/></button>
                        </div>
                    </label>
                </form>
                <div className="container-filter-by-date">
                    <label htmlFor="fecha_desde">
                        Desde: <br />
                        <input 
                            type="date" 
                            name="fecha_desde" 
                            id="fecha_desde" 
                            onChange={setDateStart}
                        />
                    </label>
                    
                    <label htmlFor="fecha_hasta">
                        Hasta: <br />
                        <input 
                            type="date" 
                            name="fecha_hasta" 
                            id="fecha_hasta" 
                            onChange={setDateEnd}
                        />
                    </label>
                </div>
                <div className="container-save-add">
                    <Link className="btn-list-detail-unities" to="/compras/unities/all">
                        <CgDetailsMore/>
                    </Link>
                    <ReactHTMLTabletToExcel
                        id="botonExportarExcel"
                        table="tabla_compras"
                        filename={`registro-de-compras ${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()} `}
                        sheet="pagina 1"
                        buttonText={<SiMicrosoftexcel/>}
                    />
                    <Link to="/compras/add">
                        <RiFileAddLine/> Agregar
                    </Link>
                </div>
            </div>

            <div className="container-total-data">
                <div>
                    <h4>Total de registros:</h4>
                    <div>{totalRegister}</div>
                </div>
                <div>
                    <h4>Total de gastos en compra:</h4>
                    <div>S/ {total}</div>
                </div>
            </div>

            <table className="tabla-ventas" id="tabla_compras">
                <tr>
                    <th>NUMERO DEL REGISTRO O CODIGO UNICO DE OPERACION</th>
                    <th>FECHA DE EMISION</th>
                    <th>TIPO</th>
                    <th>SERIE O CDA</th>
                    <th>NUMERO</th>

                    <th>TIPO</th>
                    <th>NUMERO</th>
                    <th>APELLIDOS Y NOMBRES O RAZON SOCIAL</th>

                    <th>BASE IMPONIBLE / OPERACION GRAVADA (soles)</th>
                    <th>IGV (soles)</th>

                    <th>VALOR DE LAS ADQUISIC: OPERACIÓN  NO GRAVADA  /OPERACIÓN INAFECTA</th>
                    <th>OTROS TRIBUTOS Y CARGOS (dolares)</th>
                    <th>IMPORTE TOTAL (soles)</th>
                    <th>TIPO DE CAMBIO</th>
                </tr>
                {compras.map((v) => {
                    return(
                        <tr key={v.id}>
                            <td style={{width: "30px"}}><Link to={`/compras/detail/${v.id}`}>{v.id}</Link></td>
                            <td>{v.date}</td>
                            <td>{v.document.number}</td>
                            <td>{v.serie}</td>
                            <td>{v.number}</td>
                            
                            <td>{v.type_recipe.number}</td>
                            <td style={{width: "120px"}}>{v.supplier.ruc}</td>
                            <td style={{width: "400px"}}>{v.supplier.business_name}</td>
                            
                            <td style={{width: "100px"}}>{v.tax_base}</td>
                            <td>{v.tb_igv}</td>
                                
                            <td style={{width: "150px"}}>{v.tb_total}</td>
                            <td>{v.tax_base_dolar}</td>
                            <td>{v.tb_total_dolar}</td>
                            <td>{v.change_type}</td>
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}

export default Compras
