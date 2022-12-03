import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './HomePage.css';

export default function HomePage({ setIsLogged, userData, setUserData }) {
  const [serverOptions, setServerOptions] = useState([]);
  const [selectedServer, setSelectedServer] = useState("");
  const [selectedServerError, setSelectedServerError] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState("");
  const [selectedProtocolError, setSelectedProtocolError] = useState(false);
  const [port, setPort] = useState("");
  const [portError, setPortError] = useState(false);
  const [openedPorts, setOpenedPorts] = useState([]);

  const [requestErrorMessage, setRequestErrorMessage] = useState("");
  const [requestSuccessMessage, setRequestSuccessMessage] = useState("");

  const disconnect = () => {
    localStorage.removeItem('userData');
    setIsLogged(false);
    setUserData([]);
  }

  useEffect(() => {
    /* FETCH ALL SERVERS FROM USERID */
    axios('http://89.158.38.131:3030/servers/fetch', {
      method: 'GET',
      headers: {
        "authorization": `Bearer ${userData.accessToken}`
      },
      params: {
        username: userData.username
      }
    }).then((res) => {
      const options = ["Selectionner un serveur..."];
      const servers = res.data.servers;

      servers.forEach((server) => {
        const formattedText = `${server.serverName} - [${server.ipAddress}] - (${server.id})`
        options.push(formattedText);
      });

      setServerOptions(options);
    }).catch((err) => {
      if (err) {
        console.log(err);
        if (err.response.status.toString() === '401') {
          disconnect();
        }
      }
    });

    /* FETCH ALL PORTS OPENNED */
    axios('http://89.158.38.131:3030/ports/fetch', {
      method: 'GET',
      headers: {
        "authorization": `Bearer ${userData.accessToken}`
      },
      params: {
        username: userData.username
      }
    }).then((res) => {
      const ports = res.data.ports;

      setOpenedPorts(ports);
    }).catch((err) => {
      if (err) {
        console.log(err);
        if (err.response.status.toString() === '401') {
          disconnect();
        }
      }
    });
  }, []);

  const serverOptionsJSX = () => {
    let count = 0;
    return serverOptions.map((option) => {
      count++;
      return <option key={count} value={`server-${count}`}>{option}</option>
    })
  }

  const openedPortsJSX = () => {
    let count = 0;
    return openedPorts.map((port) => {
      count++;
      return <li key={count} className='ports-list-element'>{port.protocol} | {port.port} | {port.serverName} [{port.ipAddress}]</li>
    });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const selectedServerIndex = parseInt(selectedServer.split("-")[1]) - 1;

    setSelectedServerError(false);
    setSelectedProtocolError(false);
    setPortError(false);
    setRequestErrorMessage("");
    setRequestSuccessMessage("");

    if (!port) {
      setPortError(true);
    }
    if (!selectedProtocol || selectedProtocol.toString() === 'none') {
      setSelectedProtocolError(true);
    }
    if (!selectedServer || selectedServer.toString() === 'server-1') {
      setSelectedServerError(true);
    }


    if (port && selectedProtocol.toString() !== 'none' && selectedServer.toString() !== 'server-1') {

      const portData = {
        "port": port,
        "serverName": serverOptions[selectedServerIndex].split(' ')[0],
        "ipAddress": serverOptions[selectedServerIndex].split(' ')[2].replaceAll('[', '').replaceAll(']', ''),
        "protocol": selectedProtocol.toUpperCase()
      };

      axios('http://localhost:3030/ports/create', {
        method: 'POST',
        headers: {
          "authorization": `Bearer ${userData.accessToken}`
        },
        data: {
          username: userData.username,
          port: port,
          protocol: selectedProtocol,
          ipAddress: serverOptions[selectedServerIndex].split(' ')[2].replaceAll('[', '').replaceAll(']', ''),
          serverId: serverOptions[selectedServerIndex].split(' ')[4].replaceAll('(', '').replaceAll(')', '').toUpperCase()
        }
      }).then((res) => {
        if (res.status === 200) {
          setOpenedPorts((currentData) => [...currentData, portData]);
          setSelectedServer("server-1");
          setSelectedProtocol("none");
          setPort("");
          setRequestSuccessMessage(res.data.message);
        }
      }).catch((err) => {
        if (err) {
          console.log(err);
          if (err.response.data) {
            setRequestErrorMessage(err.response.data.message);
          }
        }
      })
      // console.log(openedPorts)
      // console.log("Selected server :", serverOptions[selectedServerIndex], "Protocol :", selectedProtocol, "Port :", port)
    }

  }

  return (
    <div className="grid h-screen place-items-center">
      <form onSubmit={(event) => handleSubmit(event)} style={{ width: '392px' }} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="server">
            Selectionner le serveur
          </label>
          <select value={selectedServer || serverOptions[0]} onChange={(event) => setSelectedServer(event.target.value)} options={serverOptions} className={`block appearance-none w-full bg-gray-200 border border-gray-200  ${selectedServerError ? "border-red-500" : null} text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500`} id="server" name='server'>
            {serverOptionsJSX()}
          </select>
          {selectedServerError ?
            <p className="text-red-500 text-xs italic">Veuillez selectionner un serveur.</p>
            :
            <></>
          }
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="server">
            Selectionner le protocole
          </label>
          <select value={selectedProtocol || 'none'} onChange={(event) => setSelectedProtocol(event.target.value)} className={`block appearance-none w-full bg-gray-200 border border-gray-200 ${selectedProtocolError ? "border-red-500" : null} text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500`} id="server" name='server'>
            <option value={'none'}>Selectionner un protocole...</option>
            <option value={'tcp'}>TCP</option>
            <option value={'udp'}>UDP</option>
          </select>
          {selectedProtocolError ?
            <p className="text-red-500 text-xs italic">Veuillez selectionner le protocol.</p>
            :
            <></>
          }
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="port">
            Port à ouvrir
          </label>
          <input value={port || ''} onChange={(event) => setPort(event.target.value)} className={`shadow appearance-none border ${portError ? "border-red-500" : null} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`} id="port" type="number" placeholder="ex : 80 (serveur web)" />
          {portError ?
            <p className="text-red-500 text-xs italic">Veuillez entrer un port à ouvrir.</p>
            :
            <></>
          }
        </div>
        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Ouvrir le port
          </button>
          <button type='button' onClick={() => disconnect()} className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Se deconnecter
          </button>
        </div>
        {!requestSuccessMessage && requestErrorMessage ?
          <p className="text-red-500 text-xs italic text-center mt-3">{requestErrorMessage}</p>
          : !requestErrorMessage && requestSuccessMessage ?
            <p className="text-green-500 text-xs italic text-center mt-3">{requestSuccessMessage}</p>
            :
            <></>
        }
      </form>
      <section className='ports-section bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <h3 className='block text-gray-700 text-lg font-bold mb-2 text-center'>Ports ouverts - <span className='text-gray-500 text-xs italic'>{openedPorts.length}</span></h3>
        <ul className='ports-list'>
          {openedPortsJSX()}
        </ul>
      </section>
    </div>
  )
}
