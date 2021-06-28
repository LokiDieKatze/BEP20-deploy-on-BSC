const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Wrapped Ether', function () {
  let WETH, weth, dev, alice, bob;
  const INITIAL_SUPPLY = ethers.utils.parseEther('2000');
  const NAME = 'Wrapped Ether';
  const SYMBOL = 'WETH';

  beforeEach(async function () {
    ;[dev, alice, bob] = await ethers.getSigners();
    WETH = await ethers.getContractFactory('WETH');
    weth = await WETH.connect(dev).deploy(INITIAL_SUPPLY);
    await weth.deployed();
  });

  describe('Deployment', function () {
    it('Should have name Wrapped Ether', async function () {
      expect(await weth.name()).to.equal(NAME);
    });
    it('Should have symbol WETH', async function () {
      expect(await weth.symbol()).to.equal(SYMBOL);
    });
    it('Should mint total supply to msg.sender', async function () {
      expect(await weth.balanceOf(dev.address)).to.equal(INITIAL_SUPPLY);
    });
  });

  describe('deposit', function () {
    it('Should emit Deposited', async function () {
      expect(await weth.connect(alice).deposit({ value: ethers.utils.parseEther('2') }))
        .to.emit(weth, 'Deposited')
        .withArgs(alice.address, ethers.utils.parseEther('2'));
    });
    it('Should credit the balance of msg.sender', async function () {
      await weth.connect(alice).deposit({ value: ethers.utils.parseEther('2') });
      expect(await weth.balanceOf(alice.address)).to.equal(ethers.utils.parseEther('2'));
    });
    it('Should debit the balance of token holder', async function () {
      await weth.connect(alice).deposit({ value: ethers.utils.parseEther('2') });
      expect(await weth.balanceOf(dev.address)).to.equal(ethers.utils.parseEther('1998'));
    });
  });

  describe('withdraw', function () {
    it('Should emit Withdrawn', async function () {
      await weth.connect(bob).deposit({ value: ethers.utils.parseEther('20') });
      expect(await weth.connect(bob).withdraw({ value: ethers.utils.parseEther('10') }))
        .to.emit(weth, 'Withdrawn')
        .withArgs(bob.address, ethers.utils.parseEther('10'));
    });
    it('Should credit the balance of token holder', async function () {
      await weth.connect(bob).deposit({ value: ethers.utils.parseEther('20') });
      await weth.connect(bob).withdraw({ value: ethers.utils.parseEther('10') });
      expect(await weth.balanceOf(dev.address)).to.equal(ethers.utils.parseEther('1990'));
    });
    it('Should debit the account of the msg.sender', async function () {
      await weth.connect(bob).deposit({ value: ethers.utils.parseEther('20') });
      await weth.connect(bob).withdraw({ value: ethers.utils.parseEther('10') });
      expect(await weth.balanceOf(bob.address)).to.equal(ethers.utils.parseEther('10'));
    });
  });
});
