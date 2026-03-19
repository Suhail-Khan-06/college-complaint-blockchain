import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("ComplaintModule", (m) => {
  const complaint = m.contract("ComplaintSystem");
  return { complaint };
});
