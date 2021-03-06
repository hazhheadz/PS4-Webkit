importScripts('../../../../resources/js-test-pre.js');
importScripts("../../../resources/common.js");

description("Test deriving AES Keys with imported ECDH base key in workers");

jsTestIsAsync = true;

var extractable = true;
var jwkPrivateKey = {
    kty: "EC",
    crv: "P-256",
    x: "1FSVWieTvikFkG1NOyhkUCaMbdQhxwH6aCu4Ez-sRtA",
    y: "9jmNTLqM4cjBhdAnHcNI9YQV3O8LFmo-EdZWk8ntAaI",
    d: "ppxBSov3N8_AUcisAuvmLV4yE8e_L_BLE8bZb9Z1Xjg",
};
var jwkPublicKey = {
    kty: "EC",
    crv: "P-256",
    x: "1FSVWieTvikFkG1NOyhkUCaMbdQhxwH6aCu4Ez-sRtA",
    y: "9jmNTLqM4cjBhdAnHcNI9YQV3O8LFmo-EdZWk8ntAaI",
};

crypto.subtle.importKey("jwk", jwkPrivateKey, { name: "ECDH", namedCurve: "P-256" }, extractable, ["deriveKey"]).then(function(result) {
    privateKey = result;
    return crypto.subtle.importKey("jwk", jwkPublicKey, { name: "ECDH", namedCurve: "P-256" }, extractable, [ ]);
}).then(function(result) {
    publicKey = result;
    return crypto.subtle.deriveKey({ name:"ECDH", public:publicKey }, privateKey, {name: "aes-cbc", length: 128}, extractable, ['decrypt', 'encrypt', 'unwrapKey', 'wrapKey']);
}).then(function(result) {
    derivedKey = result;

    shouldBe("derivedKey.type", "'secret'");
    shouldBe("derivedKey.extractable", "true");
    shouldBe("derivedKey.algorithm.name", "'AES-CBC'");
    shouldBe("derivedKey.algorithm.length", "128");
    shouldBe("derivedKey.usages", "['decrypt', 'encrypt', 'unwrapKey', 'wrapKey']");

    finishJSTest();
});
