const express = require("express");
const { sequelize } = require("../models");
const { User } = require("../models");
const auth = require("../middleware/auth-middleware");

const router = express.Router();

router.get("/user/:user_id", async (req, res, next) => {
  try {
    const { user_id } = req.params;
    const exUser = await User.findOne({
      where: { user_id },
      attributes: {
        exclude: ["password", "refresh_token", "createdAt", "updatedAt"],
      },
    });

    if (!exUser) {
      return res.status(404).json({
        message: "존재하지 않는 사용자입니다.",
      });
    }

    // '팔로워'의 수 - 내가 팔로우 받는 사람의 수
    const followee_cnt_query = await sequelize.query(
      `SELECT COUNT(*) AS followee_cnt FROM Follow WHERE FolloweeId = ${exUser.id}`
    );
    const followee_cnt = followee_cnt_query[0][0].followee_cnt;

    // '팔로잉'의 수 - 내가 팔로우 하는 사람의 수
    const following_cnt_query = await sequelize.query(
      `SELECT COUNT(*) AS following_cnt FROM Follow WHERE FollowingId = ${exUser.id}`
    );
    const following_cnt = following_cnt_query[0][0].following_cnt;

    return res.status(200).json({
      ...exUser.dataValues,
      followee_cnt,
      following_cnt,
    });
  } catch (e) {
    next(e);
  }
});

router.get("/user/:user_id/follow-check", auth, async (req, res, next) => {
  try {
    const { user_id: other_user_id } = req.params;
    const { id, user_id, name } = req.user;

    const exUser = await User.findOne({
      where: { user_id: other_user_id },
    });
    if (!exUser) {
      return res.status(404).json({
        message: "존재하지 않는 사용자입니다.",
      });
    }

    const follow_check_query = await sequelize.query(
      `SELECT * FROM template.Follow WHERE FollowingId = ${id} AND FolloweeId = ${exUser.id}`
    );
    const follow_check = follow_check_query[0].length > 0 ? true : false;

    if (!follow_check) {
      return res.status(200).json({
        isFollowing: false,
      });
    }

    return res.status(200).json({
      isFollowing: true,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;