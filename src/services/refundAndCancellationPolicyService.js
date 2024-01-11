const RefundAndCancellationPolicy = require('../models/RefundAndCancellationPolicy');

const addRefundAndCancellationPolicy = async (refundAndCancellationPolicyBody) => {
  try {
    var refundAndCancellationPolicy = await findRefundAndCancellationPolicy(refundAndCancellationPolicyBody);
    if (refundAndCancellationPolicy) {
      refundAndCancellationPolicy.content = refundAndCancellationPolicyBody.content;
    }
    else {
      refundAndCancellationPolicy = new RefundAndCancellationPolicy(refundAndCancellationPolicyBody);
    }
    await refundAndCancellationPolicy.save();
    return refundAndCancellationPolicy;
  } catch (error) {
    throw error;
  }
}

const findRefundAndCancellationPolicy = async (refundAndCancellationPolicyBody) => {
  try {
    const refundAndCancellationPolicy = await RefundAndCancellationPolicy.findOne({content: refundAndCancellationPolicyBody.content});
    return refundAndCancellationPolicy;
  } catch (error) {
    throw error;
  }
}

const getRefundAndCancellationPolicys = async () => {
  try {
    return await RefundAndCancellationPolicy.findOne().select('content');
  }
  catch (error) {
    throw error;
  }
}

module.exports = {
  addRefundAndCancellationPolicy,
  getRefundAndCancellationPolicys
}
