const shelljs = require("shelljs");

const addPort = async (port, protocol, ipAddress) => {
    const shellCommand = `iptables -t nat -A PREROUTING -i vmbr0 -p ${protocol.toLowerCase()} --dport ${port} -j DNAT --to ${ipAddress}:${port}`

    const isExecuted = await shelljs.exec(shellCommand);
    if (!isExecuted.stderr) {
        shelljs.exec('iptables-save')
        return true;
    }
    return false;
}

module.exports = addPort;