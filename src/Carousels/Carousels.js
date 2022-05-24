import './Carousels.css';

import React, { setState, useContext, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import ReactJson from 'react-json-view';
import { Carousel } from 'react-responsive-carousel';

import { SearchContext, SetSearchContext } from '../App.js';
import { SocketContext } from '../index.js';

const str_server = [
    [ 'export async function getTemplates ( contract, collection, serie, nbrows, lower, way, separator, url )', 1 ],
    [ '{', 1 ],
    [ '    /* get templates by serie of a collection:', 2 ],
    [ '        1. define options to construct the command to send on the blockchain', 2 ],
    [ '        2. retrieve data from the blockchain and destructure that into { command, fields, result, lastValidData, next }', 2 ],
    [ '        3. put the result, if it\'s valid, to the resp array', 2 ],
    [ '        4. check if the result need more query, in case of it\'s bigger than the limit returned by the blockchain, if yes retrieve until nextID = 0', 2 ],
    [ '    */', 2 ],
    [ '    const maxnb = 100;', 2 ],
    [ '    let nb = nbrows, limit = ( nb > maxnb || nb === 0 ) ? maxnb : nb,', 2 ],
    [ '        resp = [], temp = [],', 3 ],
    [ '        vals = { contract: contract, account: collection, table: "templates", url: url },', 3 ],
    [ '        opts = { limit: limit, upper: serie, lower: lower, typeName: "schema_name", reverse: ""},', 3 ],
    [ '        cmd = getCommand( vals, opts ),', 3 ],
    [ '        { command, fields, result, lastValidData, next } = await execCommand( cmd, `rows`, separator );', 3 ],
    [ '    if ( result !== null && result !== undefined ){', 2 ],
    [ '        let tmp = result.filter( element => ( element[ "immutable_serialized_data" ] ).length > 0 );', 3 ],
    [ '        resp = resp.concat( tmp );', 3 ],
    [ '        nb = nbrows - resp.length;', 3 ],
    [ '    }', 2 ],
    [ '    let nextID = ( next && !isNaN( Number( next ) ) && Number( next ) > 0 ) ? Number( next ) : 0;', 2 ],
    [ '    while ( nextID > 0 && nb > 0 ){', 2 ],
    [ '        limit = ( nb > maxnb ) ? maxnb : nb;', 3 ],
    [ '        opts[ "lower" ] = nextID;', 3 ],
    [ '        opts[ "limit" ] = limit;', 3 ],
    [ '        cmd = getCommand( vals, opts );', 3 ],
    [ '        let { command, fields, result, lastValidData, next } = await execCommand( cmd, way, separator);', 3 ],
    [ '        if ( result ){', 3 ],
    [ '            temp = result.filter( element => ( element[ "immutable_serialized_data" ] ).length > 0 );', 4 ],
    [ '            resp = resp.concat( temp );', 4 ],
    [ '        }', 3 ],
    [ '        nextID = ( next && !isNaN( Number( next ) ) && Number( next ) > 0 ) ? Number( next ) : 0;', 3 ],
    [ '        nb = nbrows - resp.length;', 3 ],
    [ '    }', 2 ],
    [ '    return resp;', 2 ],
    [ '}', 1 ]
],
    str_server2 = [
        [ 'export function sortArray ( data = [], path = "", asc = true ){', 1 ],
        [ '    let resp = [];', 2 ],
        [ '    if ( Object.prototype.toString.call( data ) === \'[object Array]\' && data.length > 0 ){', 2 ],
        [ '        let object = data[ 0 ];', 3 ],
        [ '        if ( Object.prototype.toString.call( object ) === \'[object Object]\' && path !== "" )', 3 ],
        [ '        {', 3 ],
        [ '            try{', 4 ],
        [ '                let varx = ( asc ) ? " let x=a." + path + ".toLowerCase(), y=b." + path + ".toLowerCase();" : " let x=b." + path + ".toLowerCase(), y=a." + path + ".toLowerCase();"', 5 ],
        [ '                    vary = ( asc ) ? " if(x < y) {return -1}; if( x > y ) {return 1} return 0" : " if(y < x) {return -1}; if( y > x ) {return 1} return 0",', 6 ],
        [ '                    fun = varx + vary;', 6 ],
        [ '                const myFunction = ( asc ) ? new Function( "a", "b", fun ) : new Function( "b", "a", fun );', 5 ],
        [ '                resp = data.sort( myFunction );', 5 ],
        [ '            } catch ( error )', 4 ],
        [ '            {', 4 ],
        [ '                let varx = "return a." + path + " - b." + path;', 5 ],
        [ '                const myFunction = ( asc ) ? new Function( "a", "b", varx ) : new Function( "b", "a", varx );', 5 ],
        [ '                resp = data.sort( myFunction );', 5 ],
        [ '            } finally { resp = data.sort( function ( a, b ) { return a - b } ) }', 4 ],
        [ '        } else { resp = data.sort( function ( a, b ) { return a - b } ) }', 3 ],
        [ '    }', 2 ],
        [ '    return resp;', 2 ],
        [ '}', 1 ]
    ],
    str_react = [
        [ 'export function Serie ()', 1 ],
        [ '{', 1 ],
        [ '    const [ jsx, setJsx ] = useState( ( <div className="divser">', 2 ],
        [ '        <label className="label"><b>Series:</b></label>', 3 ],
        [ '        <select className="select" onChange={ ( e ) => { } }>', 3 ],
        [ '            <option></option>', 4 ],
        [ '        </select>', 3 ],
        [ '    </div> ) );', 2 ],
        [ '    const sock = useContext( SocketContext );', 2 ],
        [ '    const search = useContext( SearchContext );', 2 ],
        [ '    const setSearch = useContext( SetSearchContext );', 2 ],
        [ '    useEffect( () =>', 2 ],
        [ '    {', 2 ],
        [ '        function valueChange ( e )', 3 ],
        [ '        {', 3 ],
        [ '            let sername = e.target.value;', 4 ],
        [ '            let ok = search;', 4 ],
        [ '            if ( ok && sername !== ok[ "serie" ][ "value" ] )', 4 ],
        [ '            {', 4 ],
        [ '                ok[ "serie" ][ "value" ] = sername;', 5 ],
        [ '                setSearch( ok );', 5 ],
        [ '                console.log( search );', 5 ],
        [ '            }', 4 ],
        [ '        }', 3 ],
        [ '        sock.on( "listseries", ( resp ) =>', 3 ],
        [ '        {', 3 ],
        [ '            if ( resp && Object.prototype.toString.call( resp ) === "[object Array]" )', 4 ],
        [ '            {', 4 ],
        [ '                let data = [];', 5 ],
        [ '                data = data.concat( resp );', 5 ],
        [ '                let ok = search;', 5 ],
        [ '                if ( ok )', 5 ],
        [ '                {', 5 ],
        [ '                    ok[ "serie" ][ "value" ] = "";', 6 ],
        [ '                    ok[ "serie" ][ "data" ] = data;', 6 ],
        [ '                    setSearch( ok );', 6 ],
        [ '                } setJsx( ( <div className="divser">', 5 ],
        [ '                    <label className="label"><b>Series:</b></label>', 6 ],
        [ '                    <select className="select" onChange={ ( e ) => {valueChange( e ) } }>{ data.map( ( d, i ) => (<option key={ i } value={ d }>{ d }</option>) ) }', 6 ],
        [ '                    </select>', 6 ],
        [ '                </div> ) );', 5 ],
        [ '            }', 4 ],
        [ '        } );', 3 ],
        [ '    }, [ sock, search, setSearch, setJsx ] );', 2 ],
        [ '    return jsx;', 2 ],
        [ '}', 1 ]
    ];
export function FunctionBox ( props )
{
    const data = props.data;
    const [ clicked, setClicked ] = useState( false );
    const [ jsx, setJsx ] = useState( <></> );
    const space = 40;
    useEffect( () =>
    {
        function click ( state )
        {
            setClicked( !state );
        }
        if ( data )
        {
            if ( clicked )
            {
                setJsx( ( <div className="boxcode" onClick={ () => { click( clicked ) } }>{ data.map( ( [ st, nb ], i ) => ( <React.Fragment key={ i } ><label className="boxcodelabel" style={ { "marginLeft": ( space * nb ) } }>{ st }</label><br /></React.Fragment> ) ) }</div> ) )
            } else
            {
                setJsx( ( <div className="boxclosed" onClick={ () => { click( clicked ) } }>{ data.map( ( [ st, nb ], i ) => ( <React.Fragment key={ i } ><label className="boxclosedlabel" style={ { "marginLeft": ( space * nb ) } }>{ st }</label><br /></React.Fragment> ) ) }</div> ) );
            }
        }
    }, [ data, setJsx, clicked, setClicked ] );

    return jsx;
}
export function RangeSelect ( props )
{
    const forObj = props.name || "";
    const start = props.start || 20;
    const [ jsx, setJsx ] = useState( ( <></> ) );
    const [ value, setValue ] = useState( start );
    const search = useContext( SearchContext );
    const setSearch = useContext( SetSearchContext );
    if ( !forObj || forObj === "" )
    {
        return jsx;
    }
    function valueChange ( e )
    {
        let val = ( e.target && e.target.value ) ? e.target.value : undefined;
        if ( val )
        {
            let ok = search;
            ok[ "limits" ][ forObj ] = val;
            setValue( val );
            setSearch( ok );
        }
    }

    return ( <>
        <Form.Label>{ `nb ${forObj}: ${value}` }</Form.Label>
        <Form.Range onChange={ ( e ) => { valueChange( e ) } } value={ value } />
    </> );
}


export function CarouselLeft ( props ){
    const params = props.params || {};
    let jsx = (
        <div className="w3-main w3-padding-large" style={ { marginLeft: "5%", fontSize: "18px", paddingLeft: "20px" } }>
            <header className="w3-container w3-center" style={ { padding: "20px 16px 15px 10px" } } id="home">
                <h2 className="w3-jumbo"><b>NGUYEN Huynh Trong Bao</b></h2>
                <p><h2>Full stack developper</h2></p>
                <img src="https://miro.medium.com/max/1400/1*vHw6ENUfu71KHiyTm0BtUA.png" style={ { width: "10%", height: "10%" } } alt="" />
                <img src="https://python.developpez.com/tutoriels/debuter-avec-python-au-lycee/images/image-1.png" style={ { width: "10%", height: "10%" } } alt="" />
                <img src="https://www.vhv.rs/dpng/d/612-6126558_react-logo-png-react-js-logo-svg-transparent.png" alt="" style={ { width: "10%", height: "10%" } } />
                <img src="https://www.educative.io/cdn-cgi/image/f=auto,fit=contain,w=1200/api/page/5393602882568192/image/download/6038586442907648" style={ { width: "10%", height: "10%" } } alt="" />
                <img src='https://i2.wp.com/leblogducodeur.fr/wp-content/uploads/2020/02/c.png?w=1200&ssl=1' style={ { width: "10%", height: "10%" } } alt="" />
                <img src="https://www.valnaos.com/wp-content/uploads/2019/11/la-blockchain.jpg" style={ { width: "10%", height: "10%"} } alt="" />
                <img src="https://www2.skillsoft.com/wp-content/uploads/2018/01/Javascript_badge-277x300.png" style={ { width: "5%", height: "5%" } } alt="" />
                <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/6/62/MySQL.svg/489px-MySQL.svg.png?20100110142632" style={ { width: "5%", height: "5%" } } alt="" />
                <img src="https://guillaume-richard.fr/wp-content/uploads/2019/08/sql.png" style={ { width: "5%", height: "5%" } } alt="" />
                <br /><br />
                <img src="/w3images/profile_girl.jpg" style={ { display: "block", width: "20%", margin: "auto" } } alt="" />
            </header>
            <div className="w3-content w3-justify w3-padding-32" style={{color:"#FFFFFF"}} id="about">
                <h2>Who am i</h2>
                <hr className="w3-opacity" />
                <p>My name is Bao NGUYEN, born on october 5 1979.</p>
                <p>I'm divorced and have three kids. Yes i did it again.. </p>
                <p>Computer science is my passion.</p>
                <p>I was self employed for 17 years in my own restaurant, but on free time, i found my happiness by creating apps.</p>
                <p>I created my own cash management app for my commerce.</p>
                <p>And during the COVID period, i created e-commerce bot basing on live chat concept.</p>
                <p>My bot can, through http request, accept command and generate ticket for customer from Facebook and Whatsapp, using Node.js and Socket.IO</p>
                <p>All of that with Javasript and Typescript</p>
                <br /><br /><br />
                <h2 className="w3-padding-16">If i have to auto-evaluate my skills:</h2>
                <p className="w3-wide">Node.Js</p>
                <div className="w3-light-grey">
                    <div className="w3-container w3-center w3-padding-small w3-dark-grey" style={{width:"80%"}}>80%</div>
                </div>
                <p className="w3-wide">React.Js</p>
                <div className="w3-light-grey">
                    <div className="w3-container w3-center w3-padding-small w3-dark-grey" style={{width:"80%"}}>80%</div>
                </div>
                <p className="w3-wide">HTML and CSS </p>
                <div className="w3-light-grey">
                    <div className="w3-container w3-center w3-padding-small w3-dark-grey" style={{width:"70%"}}>70%</div>
                </div>
                <p className="w3-wide">Blockchain-NFTs </p>
                <div className="w3-light-grey">
                    <div className="w3-container w3-center w3-padding-small w3-dark-grey" style={{width:"60%"}}>60%</div>
                </div>
                <p className="w3-wide">MySQL-SQL-POSTGRE</p>
                <div className="w3-light-grey">
                    <div className="w3-container w3-center w3-padding-small w3-dark-grey" style={{width:"60%"}}>60%</div>
                </div>
                <p className="w3-wide">C and C++</p>
                <div className="w3-light-grey">
                    <div className="w3-container w3-center w3-padding-small w3-dark-grey" style={{width:"60%"}}>50%</div>
                </div>
                <p className="w3-wide">VB.NET and C#</p>
                <div className="w3-light-grey">
                    <div className="w3-container w3-center w3-padding-small w3-dark-grey" style={ { width: "70%", color:"#117c41"}}>70%</div>
                </div>
                <h2 className="w3-padding-16">My languages:</h2>
                <div className="w3-row w3-center w3-dark-grey w3-padding-16 w3-section">
                    <div className="w3-quarter w3-section"><span className="w3-xlarge">French</span><br />Perfect</div>
                    <div className="w3-quarter w3-section"><span className="w3-xlarge">Vietnamese</span><br />Mother language</div>
                    <div className="w3-quarter w3-section"><span className="w3-xlarge">English</span><br />Intermediaire</div>
                    <div className="w3-quarter w3-section"><span className="w3-xlarge">Dutch</span><br />Understanding</div>
                </div>
                <br /><br /><br />
                <h3 className="w3-padding-24">Why me?</h3>
                <p>Because coding and developing is my passion.</p>
                <p>Because the word "give up" doesn't exist in my language.</p>
                <p>Because my coding way always targets: launch time, execution vitesse, memory optimizing and errors handling.</p>
                <p>Because i never leave any challenge undone.</p>
                <p>Because when i look for a solution, i always think as far as possible any probable issue</p>
                <p>Because i believe that if it's possible to do so i'm able to do.</p>
                <p>Because i think that coding skill isn't limited by programming language border'. In the same logic, a good developer must be able to switch from a language into another without wasting months on docs</p><br />
                <br /><br /><br />
                <h3 className="w3-padding-16">My rate</h3>
                <div className="boxrow">
                    <div className="boxcol-3">
                        <div>
                            <ul className="w3-ul w3-center w3-card w3-hover-shadow">
                                <li className="w3-black w3-xlarge w3-padding-32"> ≤ year contract</li>
                                <li className="w3-padding-16">React.Js</li>
                                <li className="w3-padding-16">Node.Js</li>
                                <li className="w3-padding-16">Javascript</li>
                                <li className="w3-padding-16">MySQL</li>
                                <li className="w3-padding-16">
                                    <h2>700€</h2>
                                    <span className="w3-opacity">a day</span>
                                </li>
                                <li className="w3-light-grey w3-padding-24">
                                    <button className="w3-button w3-white w3-padding-large w3-hover-black">Freelance</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="boxcol-3">
                        <div>
                            <ul className="w3-ul w3-center w3-card w3-hover-shadow">
                                <li className="w3-black w3-xlarge w3-padding-32">> year contract</li>
                                <li className="w3-padding-16">React.Js</li>
                                <li className="w3-padding-16">Node.Js</li>
                                <li className="w3-padding-16">Javascript</li>
                                <li className="w3-padding-16">MySQL</li>
                                <li className="w3-padding-16">
                                    <h2>600€</h2>
                                    <span className="w3-opacity">a day</span>
                                </li>
                                <li className="w3-light-grey w3-padding-24">
                                    <button className="w3-button w3-white w3-padding-large w3-hover-black">Freelance</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="boxcol-3">
                        <div>
                            <ul className="w3-ul w3-center w3-card w3-hover-shadow">
                                <li className="w3-black w3-xlarge w3-padding-32">≤ year contract</li>
                                <li className="w3-padding-16">Blockchain - Production Node Setup</li>
                                <li className="w3-padding-16">NFTs - Smarts contract</li>
                                <li className="w3-padding-16">Eos.io - Wax.io - Atomicassets.io</li>
                                <li className="w3-padding-16">Python</li>
                                <li className="w3-padding-16">Data science</li>
                                <li className="w3-padding-16">
                                    <h2>1000€</h2>
                                    <span className="w3-opacity">a day</span>
                                </li>
                                <li className="w3-light-grey w3-padding-24">
                                    <button className="w3-button w3-white w3-padding-large w3-hover-black">Freelance</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="boxcol-3">
                        <div>
                            <ul className="w3-ul w3-center w3-card w3-hover-shadow">
                                <li className="w3-black w3-xlarge w3-padding-32">> year contract</li>
                                <li className="w3-padding-16">Blockchain - Production Node Setup</li>
                                <li className="w3-padding-16">NFTs - Smarts contract</li>
                                <li className="w3-padding-16">Eos.io - Wax.io - Atomicassets.io</li>
                                <li className="w3-padding-16">Python</li>
                                <li className="w3-padding-16">Data science</li>
                                <li className="w3-padding-16">
                                    <h2>800€</h2>
                                    <span className="w3-opacity">a day</span>
                                </li>
                                <li className="w3-light-grey w3-padding-24">
                                    <button className="w3-button w3-white w3-padding-large w3-hover-black">Freelance</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div> );
    return ( <div className="boxleft">
        <label className="title"><h2>{ `< view About me / >` }</h2></label>
        <div className="boxrow">
            <div className="boxcol-12"><div className="boxheader">{jsx}</div></div>
        </div>
    </div> );
};

export function CarouselCenter ()
{
    const search = useContext( SearchContext );
    return ( <div className="boxcenter">
        <label className="title"><h2>{ `< view NFTs / >` }</h2></label>
        <div className="boxrow">
            <div className="boxcol-4"><Collection /></div>
            <div className="boxcol-4"><Serie /></div>
            <div className="boxcol-4"><User /></div>
        </div>
        <div className="boxrow">
            <div className="boxcol-4"><RangeSelect name="collection" start={ search.limits.collection } /></div>
            <div className="boxcol-4"><RangeSelect name="serie" start={ search.limits.serie } /></div>
            <div className="boxcol-4"><RangeSelect name="nft" start={ search.limits.nft } /></div>
        </div>
        <div className="boxheader"><SliderVertical /></div>
        <div className="boxrow">
            <div className="boxcol-6"><SerieSearch /></div>
            <div className="boxcol-6"><UserSearch /></div>
        </div>
        <div className="boxempty"><h2 style={ { "float": "right", "fontSize": "18px" } }>{ "wanna see what commands are sent to the blockchain as queries and response? --->>>>" }</h2></div>
    </div> );
}
export function CarouselRight ()
{
    const [ data, setData ] = useState( [] );
    const sock = useContext( SocketContext );
    const [ jsx, setJsx ] = useState( <></> );
    useEffect( () =>
    {
        sock.on( 'actions', resp =>
        {
            if ( !Object.is( data, resp ) )
            {
                setData( resp )
                setJsx( ( <React.Fragment>{ data.map( ( r, i ) => <Action data={ r } key={ i } index={ i } /> ) }</React.Fragment> ) );
                console.log( 'actions', data );
            }
        } );
    }, [ sock, data, setData, setJsx ] );
    return ( <div className="boxcenter">
        <label className="title"><h2>{ `< view Actions / >` }</h2></label>
        <React.Fragment>{ data.map( ( r, i ) => <Action data={ r } key={ i } index={ i } /> ) }</React.Fragment>
    </div> );
}
export function CarouselServer ()
{

    return ( <div className="boxcenter">
        <label className="title"><h2>{ `< view server-side / >` }</h2></label>
        <div className="boxrow">
            <div className="boxcol-9"><FunctionBox data={ str_server } /></div>
            <div className="boxcol-3"><h2 style={ { "float": "left" } }>{ "<-- click to see the function" }</h2></div>
        </div>
        <div className="boxrow">
            <div className="boxcol-12"><div className="boxempty"><h3 style={ { "float": "left" } }>sort the array of JSON object to avoid overloading the cmds nb sent to the server</h3></div></div>
        </div>
        <div className="boxrow">
            <div className="boxcol-3"><h2 style={ { "float": "right" } }>{ "click to see the function -->" }</h2></div>
            <div className="boxcol-9"><FunctionBox data={ str_server2 } /></div>
        </div>
    </div> );
}
export function CarouselWeb ()
{

    return ( <div className="boxcenter">
        <label className="title"><h2>{ `< view web-side / >` }</h2></label>
        <div className="boxrow">
            <div className="boxcol-12"><div className="boxempty"><h3 style={ { "float": "right" } }>sync the select box Serie each time the collection's value is changed, also update the value ready to perform Search action</h3></div></div>
        </div>
        <div className="boxrow">
            <div className="boxcol-9"><FunctionBox data={ str_react } /></div>
            <div className="boxcol-3"><h2 style={ { "float": "left" } }>{ "<-- click to see the function" }</h2></div>
        </div>
    </div> );
}
export function SliderVertical ( props )
{
    const [ rows, setRows ] = useState( [] );
    const sock = useContext( SocketContext );
    const [ jsx, setJsx ] = useState( <></> );
    useEffect(
        () =>
        {
            sock.on( "nfts", ( resp ) =>
            {
                setRows( resp );
            } );
            setJsx(
                <Carousel
                    transitionTime={ 2000 }
                    interval={ 2000 }
                    autoPlay={ true }
                    infiniteLoop={ true }
                    showIndicators={ false }
                    showThumbs={ false }
                    showStatus={ false }
                    stopOnHover={ true }
                    centerMode={ true }
                    startOnLeave={ true }
                    selectedItem={ 0 }>
                    { rows.map( ( d, i ) => (
                        <div className="boxdiv" key={ i }>
                            <Nft data={ d } />
                        </div>
                    ) ) }
                </Carousel>,
            );
        },
        [ sock, rows ],
        undefined,
    );
    return jsx;
}
export function Nft ( props )
{
    // eslint-disable-next-line
    let data = ( props.data && props.data[ "template_data" ] ) ? props.data[ "template_data" ] : props.data;


    let image = "";
    if ( data )
    {
        //        console.log( '', data );
        if ( data[ "ipfs" ] )
        {
            image = data[ "ipfs" ];
        } else if ( data[ "ipfsv" ] )
        {
            image = data[ "ipfsv" ];
        } else if ( data[ "ipfsb" ] )
        {
            image = data[ "ipfsb" ];
        }

        const notuse = [
            "ipfs",
            "ipfsb",
            "ipfsv",
            "schema_name",
            "template_id",
            "collection_name",
            "asset_id",
        ];
        let obj = [];
        for ( let x in data )
        {
            if ( notuse.indexOf( x ) < 0 )
            {
                obj.push( [ x, data[ x ] ] );
            }
        }
        return (
            <div className="nftbox">
                <div className="txtnft">
                    { obj.map( ( [ key, value ], index ) =>
                    {
                        return (
                            <div key={ index }>
                                <label className="keysnft"><b>{ key }:</b></label>
                                <br />
                                { "  " }
                                <label className="valuenft">{ value }</label>
                                <br />
                            </div>
                        );
                    } ) }
                </div>
                <div className="imgnft">
                    <img src={ image } alt="" />
                </div>
            </div>
        );
    } else
    {
        return ( <></> );
    }
}
export function SerieSearch ()
{
    const sock = useContext( SocketContext );
    // eslint-disable-next-line
    const search = useContext( SearchContext );
    function searchClick ()
    {
        if ( search[ "collection" ] === "" || search[ "serie" ] === "" ) return;
        sock.emit(
            "nfts",
            "templates",
            search[ "collection" ][ "value" ],
            search[ "limits" ][ "nft" ],
            search[ "contract" ][ "value" ],
            search[ "serie" ][ "value" ]
        );
    }
    const jsx = (
        <div className="buttonSearchB" onClick={ () => { searchClick() } }><label className="label"><b>Search by Serie</b></label></div>
    );
    return jsx;


}
export function UserSearch ()
{
    const sock = useContext( SocketContext );
    // eslint-disable-next-line
    const search = useContext( SearchContext );
    function searchClick ()
    {
        if ( search[ 'user' ] !== "" )
        {
            sock.emit(
                "nfts",
                "assets",
                search[ "user" ][ "value" ],
                search[ "limits" ][ "nft" ],
                search[ "contract" ][ "value" ],
            )
        };
    }
    const jsx = (
        <div
            className="buttonSearchA"
            onClick={ () =>
            {
                searchClick()
            } }>
            <label className="label"><b>Search by Account</b></label>
        </div>
    );
    return jsx;
}

// eslint-disable-next-line
export function Action ( props )
{
    const index = props.index || 0;
    const data = props.data || [];
    const cmd = data[ 0 ], json = data[ 1 ];
    return (
        <div className="boxrow">
            <div className="boxcol-8"><label>{ `cmd n°${index}: ${cmd}` }</label></div>
            <div className="boxcol-4"><ReactJson theme="twilight" src={ json } name={ `response n°${index}:` } indentWidth={ 3 } collapsed={ true } /></div>
        </div> );
}

export function Collection ()
{
    const sock = useContext( SocketContext );
    // eslint-disable-next-line
    const search = useContext( SearchContext );
    const setSearch = useContext( SetSearchContext );
    const [ jsx, setJsx ] = useState( ( <div className="divcol">
        <label className="label"><b>Collections:</b></label>
        <select className="select"><option></option></select>
    </div> ) );

    useEffect( () =>
    {
        function valueChange ( e )
        {
            let colname = e.target.value;
            let ok = search;
            if ( ok && colname !== ok[ "collection" ][ "value" ] )
            {
                ok[ "collection" ][ "value" ] = colname;
                ok[ "serie" ][ "value" ] = "";
                ok[ "serie" ][ "data" ] = [ "" ];
                setSearch( ok );
                sock.emit(
                    "getdata",
                    "schemas",
                    search.contract.value,
                    search.limits.serie,
                    colname
                );
                console.log( search );
            }
        }

        sock.on( "listcols", ( resp ) =>
        {
            let data = [];
            data = data.concat( resp );
            let ok = search;
            if ( ok )
            {
                ok[ "collection" ][ "value" ] = "";
                ok[ "collection" ][ "data" ] = data;
                setSearch( ok );
            }
            setJsx( ( <div className="divcol">
                <label className="label"><b>Collections:</b></label>
                <select
                    className="select"
                    onChange={ ( e ) =>
                    {
                        valueChange( e )
                    } }>
                    { data.map( ( d, i ) => (
                        <option key={ i } value={ d }>
                            { d }
                        </option>
                    ) ) }
                </select>
            </div> ) );
            //console.log( "listcols", data );
        } );
    }, [ setJsx, sock, search, setSearch ] );

    return jsx;
}
export function Serie ()
{
    // eslint-disable-next-line
    const [ jsx, setJsx ] = useState( ( <div className="divser">
        { " " }
        <label className="label"><b>Series:</b></label>
        <select className="select" onChange={ ( e ) => { } }>
            <option></option>
        </select>
    </div> ) );
    const sock = useContext( SocketContext );
    // eslint-disable-next-line
    const search = useContext( SearchContext );
    const setSearch = useContext( SetSearchContext );

    useEffect( () =>
    {
        function valueChange ( e )
        {
            let sername = e.target.value;
            let ok = search;
            if ( ok && sername !== ok[ "serie" ][ "value" ] )
            {
                ok[ "serie" ][ "value" ] = sername;
                setSearch( ok );
                console.log( search );
            }
        }
        sock.on( "listseries", ( resp ) =>
        {
            if ( resp && Object.prototype.toString.call( resp ) === "[object Array]" )
            {
                let data = [];
                data = data.concat( resp );
                let ok = search;
                if ( ok )
                {
                    ok[ "serie" ][ "value" ] = "";
                    ok[ "serie" ][ "data" ] = data;
                    setSearch( ok );
                } setJsx( ( <div className="divser">
                    <label className="label"><b>Series:</b></label>
                    <select className="select" onChange={ ( e ) => { valueChange( e ) } }>{ data.map( ( d, i ) => ( <option key={ i } value={ d }>{ d }</option> ) ) }
                    </select>
                </div> ) );
                console.log( "listseries", data );
            }
        } );
        // eslint-disable-next-line
    }, [ sock, search, setSearch, setJsx ] );

    return jsx;
}
export function User ()
{
    // eslint-disable-next-line
    // eslint-disable-next-line
    const sock = useContext( SocketContext );
    const setSearch = useContext( SetSearchContext );
    // eslint-disable-next-line
    const search = useContext( SearchContext );
    const [ jsx, setJsx ] = useState( ( <div className="divusr">
        <label className="label"><b>Accounts:</b></label>
        <select className="select">
            <option key={ 0 } value={ "qkhai.wam" }>qkhai.wam</option>
        </select>
    </div> ) );

    useEffect( () =>
    {
        function valueChange ( e )
        {
            let username = e.target.value;
            let ok = search;
            if ( ok && username !== ok[ "user" ][ "value" ] )
            {
                ok[ "user" ][ "value" ] = username;
                setSearch( ok );
                console.log( search );
            }
        }
        sock.on( "listusers", ( resp ) =>
        {
            if ( resp && Object.prototype.toString.call( resp ) === "[object Array]" )
            {
                let data = [];
                data = data.concat( resp );
                let ok = search;
                if ( ok )
                {
                    ok[ "user" ][ "value" ] = "";
                    ok[ "user" ][ "data" ] = data;
                    setSearch( ok );
                }
                setJsx( ( <div className="divusr">
                    <label className="label"><b>Accounts:</b></label>
                    <select className="select" onChange={ ( e ) => { valueChange( e ) } }>{ data.map( ( d, i ) => ( <option key={ i } value={ d }>{ d }</option> ) ) }
                    </select>
                </div> ) );
                console.log( "listusers", data );
            }
        } );
        // eslint-disable-next-line
    }, [ sock, search, setSearch, setJsx ] );

    return jsx;
}

