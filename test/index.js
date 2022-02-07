const request = require("sync-request");
const baseUrl = "http://localhost:3000/";
const getUrl = (path) => {
  return baseUrl + path;
};

const currentTimestamp = () => {
  return "[" + new Date().toUTCString() + "] ";
};

const clientCred = {
  email: "antonelgabor@gmail.com",
  password: "Password..99",
};

const operatorCred = {
  opCode: "0001",
  password: "operatore1",
};

const headers = (withAuth) => {
  if (withAuth)
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.accessToken}`,
    };
  else
    return {
      "Content-Type": "application/json",
    };
};

let tokens = {
  accessToken: "",
  refreshToken: "",
};

let testSuccessMap = {
  login: false,
  token: false,
  signup: false,
  priv: false,
  changepassword: false,
  citizen: false,
  campaigns: false,
  hubs: false,
  slot: false,
  reservation: false,
  notification: false,
  loginOperator: false,
  privOperator: false,
  tokenOperator: false,
  campaignPost: false,
  campaignPut: false,
  campaignGet: false,
  campaignDelete: false,
  slotOperator: false,
};

console.log("\n=============================");
console.log("TEST STARTED FOR CITIZEN");
console.log("=============================\n\n");

// LOGIN
try {
  const res = request("POST", getUrl("login"), {
    headers: headers(false),
    json: clientCred,
  });
  const body = JSON.parse(res.getBody("utf8"));
  testSuccessMap.login = true;
  tokens.accessToken = body.accessToken;
  tokens.refreshToken = body.refreshToken;
  console.log("LOGIN TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.login = false;
  console.log("LOGIN TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
  process.exit(1);
}

// SIGNUP
/* try {
 *   const res = request("POST", getUrl("signup"), {
 *     headers: headers(false),
 *     json: { email: "paolo2@yopmail.com", password: "test123*" },
 *   });
 *   const body = JSON.parse(res.getBody("utf8"));
 *   testSuccessMap.signup = true;
 *   console.log("SIGNUP TEST RESULT: PASSED", currentTimestamp());
 * } catch (err) {
 *   testSuccessMap.signup = false;
 *   console.log("SIGNUP TEST RESULT: NOT PASSED", currentTimestamp());
 *   console.log("\n=============================\n");
 *   console.log(err);
 *   console.log("\n=============================\n");
 * } */

// TOKEN
try {
  const res = request("POST", getUrl("token"), {
    headers: headers(false),
    json: { refreshToken: tokens.refreshToken },
  });
  const body = JSON.parse(res.getBody("utf8"));
  testSuccessMap.token = true;
  tokens.accessToken = body.accessToken;
  tokens.refreshToken = body.refreshToken;
  console.log("TOKEN TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.token = false;
  console.log("TOKEN TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
}

// USER PRIVILEGE
try {
  const res = request("GET", getUrl("userprivilege"), {
    headers: headers(true),
  });
  res.getBody("utf8");
  testSuccessMap.priv = true;
  console.log("USER PRIVILEGE TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.priv = false;
  console.log("USER PRIVILEGE TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
}

// USER PASSWORD
try {
  const res = request("POST", getUrl("userpassword"), {
    headers: headers(true),
    json: {
      oldPassword: clientCred.password,
      newPassword: clientCred.password + "new",
    },
  });
  testSuccessMap.changepassword = true;
  res.getBody("utf8");
  console.log("CHANGE PASSWORD TEST RESULT: PASSED", currentTimestamp());

  // LOGIN
  try {
    const res = request("POST", getUrl("login"), {
      headers: headers(false),
      json: { email: clientCred.email, password: clientCred.password + "new" },
    });
    res.getBody("utf8");
    testSuccessMap.changepassword = true;
    console.log(
      "LOGIN AFTER CHANGE PASSWORD TEST RESULT: PASSED",
      currentTimestamp()
    );

    try {
      const res = request("POST", getUrl("userpassword"), {
        headers: headers(true),
        json: {
          oldPassword: clientCred.password + "new",
          newPassword: clientCred.password,
        },
      });
      res.getBody("utf8");
      testSuccessMap.changepassword = true;
      console.log(
        "CHANGE PASSWORD IN ORDER TO RESET TEST RESULT: PASSED",
        currentTimestamp()
      );
    } catch (err) {
      testSuccessMap.changepassword = false;
      console.log(
        "CHANGE PASSWORD IN ORDER TO RESET TEST RESULT: NOT PASSED",
        currentTimestamp()
      );
      console.log("\n=============================\n");
      console.log(err);
      console.log("\n=============================\n");
    }
  } catch (err) {
    testSuccessMap.changepassword = false;
    console.log(
      "LOGIN AFTER CHANGE PASSWORD TEST RESULT: NOT PASSED",
      currentTimestamp()
    );
    console.log("\n=============================\n");
    console.log(err);
    console.log("\n=============================\n");
  }
} catch (err) {
  testSuccessMap.changepassword = false;
  console.log("CHANGE PASSWORD TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
}

// CITIZEN
try {
  const res = request("GET", getUrl("citizen"), {
    headers: headers(true),
  });
  res.getBody("utf8");
  testSuccessMap.citizen = true;
  console.log("CITIZEN TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.citizen = false;
  console.log("CITIZEN TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
}

// CAMPAIGNS
try {
  const res = request("GET", getUrl("campaigns"), {
    headers: headers(true),
  });
  res.getBody("utf8");
  testSuccessMap.campaigns = true;
  console.log("CAMPAIGNS TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.campaigns = false;
  console.log("CAMPAIGNS TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
}

let hubs = [];

// HUBS
try {
  const res = request("GET", getUrl("hubs"), {
    headers: headers(true),
  });
  hubs = JSON.parse(res.getBody("utf8")).hubs;
  testSuccessMap.hubs = true;
  console.log("HUBS TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.hubs = false;
  console.log("HUBS TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
}

console.log("\n=============================");
console.log("TEST STARTED FOR OPERATOR");
console.log("=============================\n\n");

// LOGIN
try {
  const res = request("POST", getUrl("login"), {
    headers: headers(false),
    json: operatorCred,
  });
  const body = JSON.parse(res.getBody("utf8"));
  testSuccessMap.loginOperator = true;
  tokens.accessToken = body.accessToken;
  tokens.refreshToken = body.refreshToken;
  console.log("LOGIN OPERATOR TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.loginOperator = false;
  console.log("LOGIN OPERATOR RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
  process.exit(1);
}

// USER PRIVILEGE
try {
  const res = request("GET", getUrl("userprivilege"), {
    headers: headers(true),
  });
  res.getBody("utf8");
  testSuccessMap.privOperator = true;
  console.log(
    "USER PRIVILEGE OPERATOR TEST RESULT: PASSED",
    currentTimestamp()
  );
} catch (err) {
  testSuccessMap.privOperator = false;
  console.log(
    "USER PRIVILEGE OPERATOR TEST RESULT: NOT PASSED",
    currentTimestamp()
  );
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
}

// TOKEN
try {
  const res = request("POST", getUrl("token"), {
    headers: headers(false),
    json: { refreshToken: tokens.refreshToken },
  });
  const body = JSON.parse(res.getBody("utf8"));
  testSuccessMap.tokenOperator = true;
  tokens.accessToken = body.accessToken;
  tokens.refreshToken = body.refreshToken;
  console.log("TOKEN OPERATOR TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.tokenOperator = false;
  console.log("TOKEN OPERATOR TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
}

let campaignId;

// CAMPAIGN POST
try {
  const res = request("POST", getUrl("campaign"), {
    headers: headers(true),
    json: { name: "TEST CAMPAIGN", type: ["0-9", "18-29"], deletable: true },
  });
  const body = JSON.parse(res.getBody("utf8"));
  campaignId = body;
  testSuccessMap.campaignPost = true;
  console.log("CAMPAIGN POST TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.campaignPost = false;
  console.log("CAMPAIGN POST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
  process.exit(1);
}

// CAMPAIGN PUT
try {
  const res = request("PUT", getUrl("campaign"), {
    headers: headers(true),
    json: { name: "TEST CAMPAIGN NEW Name", _id: campaignId },
  });
  const body = JSON.parse(res.getBody("utf8"));
  testSuccessMap.campaignPut = true;
  console.log("CAMPAIGN PUT TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.campaignPut = false;
  console.log("CAMPAIGN PUT RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
  process.exit(1);
}

let campaigns = [];

// CAMPAIGNS
try {
  const res = request("GET", getUrl("campaigns"), {
    headers: headers(true),
  });
  const body = JSON.parse(res.getBody("utf8"));
  campaigns = body.campaigns;
  let campaign = campaigns.find((val) => val._id == campaignId);
  if (campaign.name != "TEST CAMPAIGN NEW Name") {
    throw new Error("PUT NOT CHANGED THE NAME");
  }

  testSuccessMap.campaignGet = true;
  console.log("CAMPAIGNS TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.campaignGET = false;
  console.log("CAMPAIGNS TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
}

// CAMPAIGN DELETE
try {
  const res = request("DELETE", getUrl("campaign") + "?_id=" + campaignId, {
    headers: headers(true),
  });
  const body = res.getBody("utf8");

  // CAMPAIGNS
  try {
    const res = request("GET", getUrl("campaigns"), {
      headers: headers(true),
    });
    const body = JSON.parse(res.getBody("utf8"));
    let campaigns = body.campaigns;
    let campaign = campaigns.find((val) => val._id == campaignId);
    if (campaign) {
      throw new Error("DELETED NOT WORKED");
    }

    testSuccessMap.campaignDelete = true;
    console.log("CAMPAIGNS DELETE TEST RESULT: PASSED", currentTimestamp());
  } catch (err) {
    testSuccessMap.campaignDelete = true;
    console.log("CAMPAIGNS DELETE TEST RESULT: NOT PASSED", currentTimestamp());
    console.log("\n=============================\n");
    console.log(err);
    console.log("\n=============================\n");
  }
} catch (err) {
  testSuccessMap.campaignDelete = false;
  console.log("CAMPAIGN DELETE RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
  process.exit(1);
}

let slotId;
const today = new Date();
const tomorrow = new Date(today.setDate(today.getDate() + 1));

// SLOT POST
try {
  const res = request("POST", getUrl("slot"), {
    headers: headers(true),
    json: {
      campaign_id: campaigns[0]._id,
      hub_id: hubs[0]._id,
      quantity: 50,
      date: tomorrow.getTime(),
      slots: [
        "8:00 - 8:20",
        "8:20 - 8:40",
        "8:40 - 9:00",
        "9:00 - 9:20",
        "9:20 - 9:40",
        "9:40 - 10:00",
        "10:00 - 10:20",
        "10:20 - 10:40",
        "10:40 - 11:00",
        "11:00 - 11:20",
        "11:20 - 11:40",
        "11:40 - 12:00",
        "12:00 - 12:20",
        "12:20 - 12:40",
        "12:40 - 13:00",
        "13:00 - 13:20",
        "13:20 - 13:40",
        "13:40 - 14:00",
        "14:00 - 14:20",
        "14:20 - 14:40",
        "14:40 - 15:00",
        "15:00 - 15:20",
        "15:20 - 15:40",
        "15:40 - 16:00",
        "16:00 - 16:20",
        "16:20 - 16:40",
        "16:40 - 17:00",
        "17:00 - 17:20",
        "17:20 - 17:40",
        "17:40 - 18:00",
        "18:00 - 18:20",
        "18:20 - 18:40",
        "18:40 - 19:00",
      ],
    },
  });
  const body = JSON.parse(res.getBody("utf8"));
  slotId = body;
  testSuccessMap.slotOperator = true;
  console.log("SLOT OPERATOR TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.slotOperator = false;
  console.log("SLOT OPERATOR TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
  process.exit(1);
}

console.log("\n=============================");
console.log("TEST STARTED FOR RESERVATION");
console.log("=============================\n\n");

// LOGIN
try {
  const res = request("POST", getUrl("login"), {
    headers: headers(false),
    json: clientCred,
  });
  const body = JSON.parse(res.getBody("utf8"));
  testSuccessMap.login = true;
  tokens.accessToken = body.accessToken;
  tokens.refreshToken = body.refreshToken;
  console.log("LOGIN TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.login = false;
  console.log("LOGIN TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
  process.exit(1);
}

// RESERVATION POST
try {
  const res = request("POST", getUrl("reservation"), {
    headers: headers(true),
    json: {
      _campaign_id: campaigns[0]._id,
      _hub_id: hubs[0]._id,
      __id: slotId,
    },
  });
  const body = JSON.parse(res.getBody("utf8"));
  slotId = body;
  testSuccessMap.reservation = true;
  console.log("RESERVATION TEST RESULT: PASSED", currentTimestamp());
} catch (err) {
  testSuccessMap.reservation = false;
  console.log("RESERVATION TEST RESULT: NOT PASSED", currentTimestamp());
  console.log("\n=============================\n");
  console.log(err);
  console.log("\n=============================\n");
  process.exit(1);
}
