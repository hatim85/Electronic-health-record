"use strict";

const express = require("express");
const { invokeTransaction } = require("../utils/invoke");
const { getQuery } = require("../utils/query");
const { registerUser } = require("../utils/helper");

const router = express.Router();

/**
 * Register and onboard an insurance agent
 * Only insuranceAdmin (Org2) can do this
 */
router.post("/register", async (req, res) => {
  try {
    const { userId,userRole,agentId, insuranceCompany, name, city } = req.body;

    if (!agentId || !insuranceCompany || !name || !city) {
      return res
        .status(400)
        .json({
          error: "agentId, insuranceCompany, name, and city are required",
        });
    }

    // Register insurance agent identity in CA (Org2)
    const registerRes = await registerUser(
      userId, // Org2 admin handles registration
      agentId, // user ID
      "insuranceAgent", // role
      { insuranceCompany, name, city }
    );

    res.json({
      message:
        "Insurance agent registered successfully with wallet identity and chaincode profile",
      registerRes,
    });
  } catch (error) {
    console.error("Error registering insurance agent:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Issue insurance for a patient
 * Both insurance agent and insurance admin can do this
 */
router.post("/issue", async (req, res) => {
  try {
    const {
      userId,
      userRole,
      patientId,
      policyNumber,
      coverageAmount,
      insuranceCompany,
    } = req.body;

    if (
      !userId ||
      !patientId ||
      !policyNumber ||
      !coverageAmount ||
      !insuranceCompany
    ) {
      return res
        .status(400)
        .json({
          error:
            "insuranceId, patientId, policyNumber, coverageAmount, and insuranceCompany are required",
        });
    }

    const args = {
      userId,
      patientId,
      policyNumber,
      coverageAmount,
      insuranceCompany,
    };

    // Use the invoking user's identity (agent or admin)
    const result = await invokeTransaction(
      "issueInsurance",
      args,
      userId,
      userRole
    );
    res.json(result);
  } catch (error) {
    console.error("Error issuing insurance:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all claims for an insurance company
 */
router.get("/claims/:userId", async (req, res) => {
  try {
    const { userId,role } = req.params;
    const args = { insuranceCompany: userId };

    const result = await getQuery(
      "getAllClaimsByInsurance",
      args,
      userId,
      'Org2'
    );
    res.json(result);
  } catch (error) {
    console.error("Error fetching claims:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Approve claim based on patient
 */
router.post("/approveClaim", async (req, res) => {
  try {
    const { userId,userRole, claimId, patientId } = req.body;

    if (!userId || !claimId || !patientId) {
      return res
        .status(400)
        .json({ error: "insuranceId, claimId, and patientId are required" });
    }

    const args = { claimId, patientId };
    const result = await invokeTransaction(
      "approveClaim",
      args,
      userId,
      userRole
    );
    res.json(result);
  } catch (error) {
    console.error("Error approving claim:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Onboard a new insurance company
 * Only insuranceAdmin (Org2) can do this
 */
router.post("/onboard", async (req, res) => {
  try {
    const { userId,companyId, name, city } = req.body;
    console.log("Onboarding insurance company:", req.body);

    if (!companyId || !name || !city) {
      return res
        .status(400)
        .json({ error: "companyId, name, and city are required" });
    }

    const args = { companyId, name, city };

    // Correct call to registerUser
    const result = await registerUser(
      userId,               // enrollId → let orgToAdminID handle it
      companyId,          // userID
      "insuranceCompany", // userRole
      args                // metadata
    );

    res.json({
      message: `Insurance company ${companyId} onboarded successfully`,
      result,
    });
  } catch (error) {
    console.error("Error onboarding insurance company:", error);
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
