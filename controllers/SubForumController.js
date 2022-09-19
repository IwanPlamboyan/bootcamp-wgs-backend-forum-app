import SubForum from '../models/SubForumModel.js';
import validator from 'validator';
import MainForum from '../models/MainForumModel.js';

export const getAllSubForum = async (req, res) => {
  try {
    const subForums = await SubForum.findAll({
      attributes: ['id', 'title', 'description'],
    });

    res.status(200).json(subForums);
  } catch (error) {
    console.log(error.message);
  }
};

export const getSubForumById = async (req, res) => {
  try {
    const response = await SubForum.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const tambahSubForum = async (req, res) => {
  const title = req.body.title.toLowerCase();
  const { description, main_id } = req.body;
  if (validator.isEmpty(title)) return res.status(204).json({ msg: 'Judul harus diisi' });

  try {
    const duplikatTitleMainForum = await SubForum.findOne({
      where: { title: title },
    });

    if (duplikatTitleMainForum !== null) return res.status(422).json({ msg: 'Judul sudah ada' });

    await SubForum.create({ title, description, main_id });
    res.status(201).json({ msg: 'Sub Forum berhasil dibuat' });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateSubForum = async (req, res) => {
  const { oldTitle, newTitle } = req.body;
  if (validator.isEmpty(newTitle)) return res.status(204).json({ msg: 'Judul harus diisi' });

  try {
    if (oldTitle !== newTitle) {
      const duplikatMainForum = await SubForum.findOne({
        where: {
          title: newTitle.toLowerCase(),
        },
      });

      if (duplikatMainForum !== null) return res.status(400).json({ msg: 'Judul sudah ada' });
    }

    await SubForum.update({ title, description, main_id }, { where: req.params.id });
    res.status(201).json({ msg: 'Sub Forum berhasil diupdate' });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteSubForum = async (req, res) => {
  const subForum = await SubForum.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!subForum) return res.status(404).json({ msg: 'Data tidak ditemukan' });

  try {
    await SubForum.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'Sub Forum berhasil dihapus' });
  } catch (error) {
    console.log(error.message);
  }
};
