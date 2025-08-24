// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IDEX
 * @dev Interface for DEX operations (Uniswap V3 compatible)
 */
interface IDEX {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    struct ExactInputParams {
        bytes path;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
    }

    /**
     * @dev Swaps exact amount of input tokens for as many output tokens as possible
     */
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);

    /**
     * @dev Swaps exact amount of input tokens for as many output tokens as possible along a path
     */
    function exactInput(ExactInputParams calldata params) external payable returns (uint256 amountOut);

    /**
     * @dev Returns the amount of output tokens for a given input amount
     */
    function quoteExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint24 fee,
        uint256 amountIn,
        uint160 sqrtPriceLimitX96
    ) external returns (uint256 amountOut);

    /**
     * @dev Returns the amount of output tokens for a given input amount along a path
     */
    function quoteExactInput(bytes calldata path, uint256 amountIn) external returns (uint256 amountOut);
}
